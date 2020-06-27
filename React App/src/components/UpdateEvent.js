import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import FormComp from "./Form";

export default class UpdateEvent extends Component {
  state = {
    injectedState: this.props.location.state,
  };

  render() {
    //Redirect to Home page if Illegal access
    if (!this.state.injectedState) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <FormComp
          formType="Update"
          reqPath="/event-update"
          update_data={this.state.injectedState.event}
          consistency={this.props.consistency}
        />
      </div>
    );
  }
}
