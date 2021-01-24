import { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: <Spinner animation="grow" size="sm" />,
    };
  }

  componentDidMount() {
    var baseUrl = this.props.baseUrl;
    var context = this;
    let intervalId = setInterval(function () {
      let url = `${baseUrl}/magic_controller/internal_temperature`;
      fetch(url, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => response.text())
        .then((result) => {
          context.setState({
            temperature: result,
          });
          // console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
  }
  render() {
    return (
      <Navbar className="nav-bar" bg="light" variant="light" sticky="top">
        <Navbar.Brand href="#home">
          <h1>MMB Tester</h1>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Badge align="right" variant="info">
              Internal Temperature: {this.state.temperature}
            </Badge>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default NavBar;
