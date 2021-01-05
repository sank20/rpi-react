import React, { Component } from "react";
// import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

class DeleteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteLabel: "Select file to delete ->",
      fileDropDownList: [],
      deleteFileName: null,
      newUpload: props.newUpload,
    };
  }

// TODO: Clear all warnings, use recommended stuff
  baseUrl = "http://192.168.0.42:8000";
  getAllFiles = () => {
    let url = `${this.baseUrl}/music/music_files`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    //   console.log("new upload caught in child component");
    //   console.log(this.props.newUpload);
    //   console.log(prevProps.newUpload);
    if (this.props.newUpload == true && prevProps.newUpload==false ) {
      populateFiles(this);
    }
  }
  componentDidMount() {
    populateFiles(this);
  }

  changeButtonLabel = (fileName) => (e) => {
    console.log(" trying to delete : " + fileName);
    this.setState({
      deleteLabel: "Delete '" + fileName + "'",
      deleteFileName: fileName,
    });
  };

  deleteFile = () => {
    let url = `${this.baseUrl}/music/file?filename=${this.state.deleteFileName}`;
    // console.log(url);
    fetch(url, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      // .then((result) => result.json())
      .then((result) => {
        this.setState({
          deleteLabel: "Select file to delete ->",
        });
        alert("File deleted successfully");
        populateFiles(this);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, please select an audio file");
      });
  };
  render() {
    // console.log("in render");
    const { fileDropDownList } = this.state;

    return (
      <Dropdown as={ButtonGroup}>
        <Button variant="outline-danger" onClick={this.deleteFile}>
          {this.state.deleteLabel}{" "}
        </Button>

        <Dropdown.Toggle split variant="outline-danger" id="dropdown-split-basic" />

        <Dropdown.Menu>{this.state.fileDropDownList}</Dropdown.Menu>
      </Dropdown>
    );
  }
}
function populateFiles(context) {
  context
    .getAllFiles()
    .then((result) => result.json())
    .then((result) => {
      const dropDownButtons = result.map((fileName, index) => {
        return (
          <Dropdown.Item
            key={index}
            onClick={context.changeButtonLabel(fileName)}
          >
            {fileName}
          </Dropdown.Item>
        );
      });
      context.setState({
        fileDropDownList: dropDownButtons,
        newUpload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default DeleteButton;
