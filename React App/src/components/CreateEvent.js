import React, { Component } from "react";
import FormComp from "./Form";

export default class CreateEvent extends Component {
  render() {
    return (
      <div>
        <FormComp
          formType="Create"
          reqPath="/create-event"
          consistency={this.props.consistency}
        />
      </div>
    );
  }
}
