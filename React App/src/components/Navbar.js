import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Navbar, Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class navbar extends Component {
  //Logout handler
  handleLogOut = async (event) => {
    event.preventDefault();
    try {
      Auth.signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <Navbar bg="light">
        <Navbar.Brand href="/">Event Scheduler</Navbar.Brand>
        <Link
          to={{
            pathname: "/CreateEvent",
          }}
        >
          Create New
        </Link>
        <Nav className="ml-auto">
          <Button
            className="float-right"
            href="/"
            onClick={this.handleLogOut}
            variant="outline-primary"
          >
            Sign Out
          </Button>
        </Nav>
      </Navbar>
    );
  }
}
