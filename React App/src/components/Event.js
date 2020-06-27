import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Event extends Component {
  render() {
    //console.log(this.props);
    const currentEvent = this.props;
    //console.log(currentEvent);
    return (
      <tr>
        <td class="column1">{currentEvent.EventName}</td>
        <td class="column2">{currentEvent.EventDescription}</td>
        <td class="column3">{currentEvent.EventStatus}</td>
        <td class="column4">{currentEvent.EventSchedule.Start_time}</td>
        <td class="column5">{currentEvent.EventSchedule.Stop_time}</td>
        <td class="column6">
          <Link
            className="btn btn-primary"
            to={{
              pathname: "/UpdateEvent",
              state: {
                event: currentEvent,
              },
            }}
          >
            Update Here
          </Link>
        </td>
      </tr>
    );
  }
}
