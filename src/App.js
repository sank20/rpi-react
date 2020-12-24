import React, { Component } from "react";
import DeleteButton from "./DeleteButton";
import Spinner from "react-bootstrap/Spinner";
// import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
// import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faPause } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

class App extends Component {
  state = {
    fileDropDownList: [],
    deleteLabel: null,
    newUpload: false,
    uploadStart: false,
    volume: 50,
    playStatus: "stopped",
  };

  deleteButtonLabel = "Select file to delete ->";
  // fileList = [];
  // fileDropDownList = [];
  baseUrl = "http://192.168.0.42:8000";
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

  getAllFiles = () => {
    let url = `${this.baseUrl}/music/music_files`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
        // -----------------re-populating the files -----------------
        //   this.getAllFiles()
        //     .then((result) => result.json())
        //     .then((result) => {
        //       this.setState({
        //         fileDropDownList: result,
        //       });
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
        // })
        // .catch((error) => {
        //   console.error("Error:", error);
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
      // .then((result) => result.json())
      .then((result) => {
        // console.log(result);
        // this.setState({
        //   result: result,
        // });
      })
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

  // handlePlayback = (val) => {
  //   console.log("toggle group pressed");
  //   console.log(val[0]);
  //   if (val[0] == "play") {
  //     this.playMusic();
  //   } else if (val[0] == "stop") {
  //     this.stopMusic();
  //   }
  // };

  render() {
    return (
      <div className="App">
        <h1>MMB Tester</h1>
        <Form>
          <Table striped bordered>
            <tbody>
              <tr>
                <Form.Group controlId="music">
                  <td>
                    <Form.Label>Music:</Form.Label>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button
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
                      <Button value={"stop"} onClick={this.stopMusic}>
                        <FontAwesomeIcon icon={faStop} />
                      </Button>
                      {/* <ToggleButton value={3}>Option 3</ToggleButton> */}
                    </ButtonGroup>
                  </td>
                  <tr>
                    <td>
                      <Form.Label>Volume:</Form.Label>
                    </td>
                    <td>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        // value="100"
                        className="slider"
                        id="myRange"
                        onChange={this.setVolume}
                      />
                      <span>{this.state.volume}%</span>
                    </td>
                  </tr>
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>Update Music File:</Form.Label>
                  {/* <input
              type="file"
              id="file_input"
              onChange={this.uploadFile}
            ></input> */}
                  <Form.File
                    id="file_input"
                    label="Select file top upload"
                    onChange={this.uploadFile}
                  />
                  <span
                    className={this.state.uploadStart == false ? "hidden" : ""}
                  >
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                    <b>Uploading...</b>
                  </span>
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>Delete Music File:</Form.Label>
                  <DeleteButton newUpload={this.state.newUpload} />
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>LED Strip:</Form.Label>

                  <input className="tgl tgl-light" id="cb1" type="checkbox" />
                  <label className="tgl-btn"></label>
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>Movement (dance) :</Form.Label>
                  <input className="tgl tgl-light" id="cb1" type="checkbox" />
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>Mystery Box (ring):</Form.Label>
                  <input className="tgl tgl-light" id="cb1" type="checkbox" />
                </Form.Group>
              </tr>

              <tr>
                <Form.Group>
                  <Form.Label>Trigger Spell:</Form.Label>
                  <button type="button">Locomotor</button>
                  <button type="button">Arresto Momentum</button>
                  <button type="button">Revelio</button>
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>Camera View</Form.Label>

                  {/* Add component here */}
                </Form.Group>
              </tr>
              <tr>
                <Form.Group>
                  <Form.Label>Wand movement view:</Form.Label>

                  {/* Add component here */}
                </Form.Group>
              </tr>
            </tbody>
          </Table>
        </Form>
      </div>
    );
  }
}

export default App;
