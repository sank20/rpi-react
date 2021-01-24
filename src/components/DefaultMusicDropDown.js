import { Component } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Toast from "react-bootstrap/Toast";
import ToastHeader from "react-bootstrap/ToastHeader";
import ToastBody from "react-bootstrap/ToastBody";
class DefaultMusicDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      musicList: null,
      toastShow: false,
    };
  }
  setDefaultMusic = (filename) => (e) => {
    let url = `${this.props.baseUrl}/music/set_default_music?new_default=${filename}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.text())
      .then((result) => {
        console.log("default music set!: " + result);
        this.setState({
          toastShow: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getAllFiles = () => {
    let url = `${this.props.baseUrl}/music/music_files`;
    fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        let dropDownArray = [];
        let index = 1;
        result.forEach((element) => {
          dropDownArray.push(
            <Dropdown.Item key={index} onClick={this.setDefaultMusic(element)}>
              {element}
            </Dropdown.Item>
          );
          index++;
        });
        console.log("got music files for default music list");
        this.setState({
          musicList: dropDownArray,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getAllFiles();
  }

  toastClose = () => {
    this.setState({
      toastShow: false,
    });
  };
  render() {
    return (
      <div
        className="default-music-component"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "relative",
        //   minHeight: "200px",
        }}
      >
        <DropdownButton id="dropdown-basic-button" title="Select Default Music">
          {this.state.musicList}
        </DropdownButton>

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <Toast
            onClose={this.toastClose}
            show={this.state.toastShow}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="mr-auto">Music</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body>New Default Music set</Toast.Body>
          </Toast>
        </div>
      </div>
    );
  }
}
export default DefaultMusicDropDown;
