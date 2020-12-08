import React, { Component } from "react";
import DeleteButton from "./DeleteButton";
class App extends Component {
  state = {
    fileDropDownList: [],
    deleteLabel: null,
    newUpload : false
  };
//   TODO: Add progress dialog for upload
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
        // this.setState({
        //   result: result,
        // });
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
        // this.setState({
        //   result: result,
        // });
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
        this.setState({
          newUpload : true
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
    console.log(volumeLevel);
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

  pauseToggle = false; //if true, the audio is paused
  pauseMusic = () => {
    let url;
    if (this.pauseToggle==true) {
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
        this.pauseToggle = !this.pauseToggle;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="App">
        <h1>MMB Tester</h1>
        <ol>
          <li>
            Music:
            <button type="button" onClick={this.playMusic}>
              Play
            </button>
            <button type="button" onClick={this.stopMusic}>
              Stop
            </button>
            <button type="button">Pause</button>
            <br />
            Volume:
            <input
              type="range"
              min="1"
              max="100"
              // value="100"
              className="slider"
              id="myRange"
              onChange={this.setVolume}
            />
          </li>
          <li>
            Update Music File:
            <input
              type="file"
              id="file_input"
              onChange={this.uploadFile}
            ></input>
          </li>
          <li>
            Delete Music File:
            <DeleteButton newUpload={this.state.newUpload}/>
          </li>
          <li>
            LED Strip:
            <input className="tgl tgl-light" id="cb1" type="checkbox" />
            <label className="tgl-btn"></label>
          </li>
          <li>
            Movement (dance) :
            <input className="tgl tgl-light" id="cb1" type="checkbox" />
          </li>
          <li>
            Mystery Box (ring):
            <input className="tgl tgl-light" id="cb1" type="checkbox" />
          </li>
          <li>
            Trigger Spell:
            <button type="button">Locomotor</button>
            <button type="button">Arresto Momentum</button>
            <button type="button">Revelio</button>
          </li>
          <li>Camera View</li>
          {/* Add component here */}
          <li>Wand movement view:</li>
          {/* Add component here */}
        </ol>
      </div>
    );
  }
}

export default App;
