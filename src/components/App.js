import React, { Component } from "react";
import DeleteButton from "./DeleteButton";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faPause } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import bsCustomFileInput from "bs-custom-file-input";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { config } from "../constants";
import CameraViewDialog from "./CameraViewDialog";
import NavBar from "./NavBar";
import DefaultMusicDropDown from "./DefaultMusicDropDown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
class App extends Component {
  state = {
    fileDropDownList: [],
    deleteLabel: null,
    newUpload: false,
    uploadStart: false,
    volume: 50,
    playStatus: "stopped",
    danceSpeed: 50,
    danceDirection: 0,
    runSequentially: false,
  };

  deleteButtonLabel = "Select file to delete ->";
  // fileList = [];
  // fileDropDownList = [];
  baseUrl = config.url;
  // Play API call
  playMusic = () => {
    let url = `${this.baseUrl}/music/play`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      // .then((result) => result.json())
      .then((result) => {
        this.setState({
          playStatus: "playing",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  stopMusic = () => {
    let url = `${this.baseUrl}/music/stop`;
    // console.log(url);
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      // .then((result) => result.json())
      .then((result) => {
        // console.log(result);
        this.setState({
          playStatus: "stopped",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  uploadFile = () => {
    this.setState({
      uploadStart: true,
    });
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    // formData.append("username", "abc123");
    formData.append("file", fileField.files[0]);

    fetch(`${this.baseUrl}/music/file`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        document.getElementById("file_input").value = "";
        this.setState({
          newUpload: true,
          uploadStart: false,
        });
      });
  };

  setVolume = () => {
    var slider = document.getElementById("myRange");
    let volumeLevel = slider.value / 100;
    // console.log(volumeLevel);
    this.setState({
      volume: slider.value,
    });
    // const formData = new FormData();
    // formData.append("volume", volumeLevel);
    let url = `${this.baseUrl}/music/volume?volume=${volumeLevel}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      // body: formData,
    })
      .then((result) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  pauseToggle = false; //if true, the audio was paused
  pauseMusic = () => {
    let url;
    if (this.pauseToggle == true) {
      url = `${this.baseUrl}/music/unpause`;
    } else {
      url = `${this.baseUrl}/music/pause`;
    }
    // console.log(url);
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((result) => {
        this.setState({
          playStatus: this.pauseToggle == true ? "unpaused" : "paused",
        });
        this.pauseToggle = !this.pauseToggle;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  danceSwitch = () => {
    let ds = document.getElementById("dance-switch");
    let action;
    if (ds.checked === true) {
      action = "start";
    } else if (ds.checked === false) {
      action = "stop";
    }
    let requestDataRaw = JSON.stringify({
      action: action,
    });
    let url = `${this.baseUrl}/mechanism/dance`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: requestDataRaw,
    })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ringSwitch = () => {
    let url = `${this.baseUrl}/mechanism/pop_ring`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setDanceSettings = (v) => {
    let speedRange = document.getElementById("danceSpeed");
    let requestBody;
    if (typeof v === "number") {
      //direction
      let direction;
      if (v === 1) direction = 1;
      else direction = -1;
      requestBody = JSON.stringify({
        direction: direction,
      });
    } else {
      //speed
      requestBody = JSON.stringify({
        speed: speedRange.value / 100,
      });
    }

    let url = `${this.baseUrl}/mechanism/dance_settings`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: requestBody,
    })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getDanceSettings = () => {
    let url = `${this.baseUrl}/mechanism/dance_settings`;
    fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        let speed = result.speed;
        let direction = result.direction === -1 ? 2 : 1;
        // console.log(" speed:" + speed + " , " + " direction:" + direction);
        this.setState({
          danceSpeed: speed * 100,
          danceDirection: direction,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setMagicSettings = () => {
    // console.log("sequential switch clicked!")
    let ds = document.getElementById("sequential-switch");
    let requestDataRaw = JSON.stringify({
      run_sequentially: ds.checked,
    });
    let url = `${this.baseUrl}/magic_controller/settings`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: requestDataRaw,
    })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setHutLight = () => {
    let hs = document.getElementById("hut-switch");
    let action;
    if (hs.checked === true) {
      action = "on";
    } else if (hs.checked === false) {
      action = "off";
    }
    // console.log("sequential switch clicked!")
    let requestDataRaw = JSON.stringify({
      state: action,
    });
    let url = `${this.baseUrl}/magic_controller/hut_light`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: requestDataRaw,
    })
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getMagicControllerSettings = () => {
    let url = `${this.baseUrl}/magic_controller/settings`;
    fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        let rs = result.run_sequentially;
        this.setState({
          runSequentially: rs,
        });
        if (rs === true) {
          let sw = document.getElementById("sequential-switch");
          sw.checked = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  renderTooltip = (
    <Tooltip id="button-tooltip">
      This plays the current music only. If you changed the default music,
      restart the server to play it here
    </Tooltip>
  );
  componentDidMount() {
    bsCustomFileInput.init();
    this.getDanceSettings();
    this.getMagicControllerSettings();
  }
  render() {
    return (
      <div className="App">
        <NavBar baseUrl={this.baseUrl} />
        <div className="card-parent">
          <Card className="main-card">
            <Card.Body className="card-body">
              <Form>
                {/* <ListGroup variant='flush'> */}
                {/* <ListGroup.Item> */}
                <Form.Group controlId="music">
                  <Form.Label className="label">Music:</Form.Label>
                  <ButtonGroup>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={this.renderTooltip}
                    >
                      <Button
                        variant="outline-warning"
                        value={"play"}
                        onClick={
                          this.state.playStatus == "stopped"
                            ? this.playMusic
                            : this.pauseMusic
                        }
                      >
                        {this.state.playStatus == "stopped" ||
                        this.state.playStatus == "paused" ? (
                          <FontAwesomeIcon icon={faPlay} />
                        ) : (
                          <FontAwesomeIcon icon={faPause} />
                        )}
                      </Button>
                    </OverlayTrigger>
                    <Button
                      variant="outline-warning"
                      value={"stop"}
                      onClick={this.stopMusic}
                    >
                      <FontAwesomeIcon icon={faStop} />
                    </Button>
                    {/* <ToggleButton value={3}>Option 3</ToggleButton> */}
                  </ButtonGroup>
                </Form.Group>
                {/* </ListGroup.Item> */}
                {/* <ListGroup.Item> */}
                <Form.Group>
                  <Form.Label>Volume:</Form.Label>
                  <Form.Control
                    type="range"
                    custom
                    min="1"
                    max="100"
                    // value="100"
                    className="slider"
                    id="myRange"
                    onChange={this.setVolume}
                  />

                  <Form.Label>
                    {this.state.volume} <span id="percentage-symbol">$</span>
                  </Form.Label>
                </Form.Group>
                <Form.Group>
                  <DefaultMusicDropDown baseUrl={this.baseUrl} />
                </Form.Group>
                <Form.Group>
                  <Form.File
                    id="file_input"
                    label="Update music file"
                    onChange={this.uploadFile}
                    custom
                    style={{ width: "50%" }}
                  />
                  <span
                    className={this.state.uploadStart == false ? "hidden" : ""}
                  >
                    <Spinner animation="border" role="status">
                      <Form.Label className="sr-only">Loading...</Form.Label>
                    </Spinner>
                    <b>Uploading...</b>
                  </span>
                </Form.Group>
                {/* </ListGroup.Item> */}
                {/* <ListGroup.Item> */}
                <Form.Group>
                  <Form.Label>Delete Music File:</Form.Label>
                  <DeleteButton
                    newUpload={this.state.newUpload}
                    baseUrl={this.baseUrl}
                  />
                </Form.Group>
                {/* </ListGroup.Item> */}
                {/* <ListGroup.Item> */}
                <Form.Group>
                  <Form.Check
                    type="switch"
                    id="dance-switch"
                    label="Movement (dance)"
                    onChange={this.danceSwitch}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Dance Speed:</Form.Label>
                  <Form.Control
                    type="range"
                    custom
                    min="1"
                    max="100"
                    value={this.state.danceSpeed}
                    className="slider"
                    id="danceSpeed"
                    onChange={this.setDanceSettings}
                  />

                  <Form.Label>
                    {this.state.danceSpeed}{" "}
                    <span id="percentage-symbol">$</span>
                  </Form.Label>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Dance Direction:</Form.Label>

                  <ToggleButtonGroup
                    type="radio"
                    name="direction"
                    defaultValue={this.state.danceDirection}
                    id="directionGroup"
                    onChange={this.setDanceSettings}
                  >
                    <ToggleButton value={1}>Clockwise</ToggleButton>
                    <ToggleButton value={2}>Anticlockwise</ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
                <Form.Group>
                  <Button
                    // type="switch"
                    id="ring-switch"
                    variant="info "
                    onClick={this.ringSwitch}
                  >
                    Mystery Box (ring)
                  </Button>
                </Form.Group>
                <Form.Group>
                  <CameraViewDialog baseUrl={this.baseUrl} />
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="switch"
                    id="sequential-switch"
                    label="Run Magic Controller Sequentially"
                    onChange={this.setMagicSettings}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="switch"
                    id="hut-switch"
                    label="Hut Light"
                    onChange={this.setHutLight}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
