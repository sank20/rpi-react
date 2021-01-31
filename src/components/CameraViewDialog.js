import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { Component } from "react";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
class CameraViewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      intervalId: 0,
      lastSpell: <Spinner animation="grow" size="sm" />
    };
  }

  // getLastSpell = () => {};
  openModal = () => {
    var baseUrl = this.props.baseUrl;
    var context = this;
    let intervalId = setInterval(function () {
      let url = `${baseUrl}/video/last_spell`;
      fetch(url, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => response.text())
        .then((result) => {
          let spell = result.replaceAll('"', "");
          context.setState({
            lastSpell: spell,
          });
          // console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1500);
    // console.log("interval id=" + intervalId);
    this.setState({
      showModal: true,
      intervalId: intervalId,
    });
  };
  render() {
    return (
      <>
        <Button variant="info" onClick={this.openModal}>Show Camera-View</Button>
        <Modal
          size="lg"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
            clearInterval(this.state.intervalId);
          }}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Camera
              <Badge align="right" variant="dark">
                Last spell: {this.state.lastSpell}
              </Badge>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <img
              className="camera-stream"
              src={this.props.baseUrl + "/video/start_stream"}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CameraViewDialog;
