import React, { Component } from "react";
import Event from "./Event";

export default class EventContainer extends Component {
  render() {
    const eventProp = this.props.events;
    //console.log(eventProp);
    return (
      <div class="limiter">
        <div class="container-table100">
          <div class="wrap-table100">
            <div class="table100">
              <table>
                <thead>
                  <tr class="table100-head">
                    <th class="column1">Name</th>
                    <th class="column2">Description</th>
                    <th class="column3">Status</th>
                    <th class="column4">Start Time</th>
                    <th class="column5">End Time</th>
                    <th class="column6">Update Link</th>
                  </tr>
                </thead>
                <tbody>
                  {eventProp &&
                    eventProp.eventList.map((eventInfo) => (
                      <Event {...eventInfo} />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
