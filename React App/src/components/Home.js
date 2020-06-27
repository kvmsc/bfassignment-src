import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import EventContainer from "./EventContainer";

export default class Home extends Component {
  //Function to fetch and store latest event Data
  fetchEvents = async (userId) => {
    try {
      const apiName = "event-scheduler-api";
      const path = "/events";
      const myInit = {
        // OPTIONAL
        headers: {}, // OPTIONAL
        queryStringParameters: {
          uid: userId,
        },
      };
      const response = await API.get(apiName, path, myInit);
      //Storing the New Event List to the state variables
      this.props.events.setEventList(response);
      this.props.consistency.setConsistency(true);
    } catch (err) {
      console.log(err);
    }
  };

  componentWillMount = () => {
    //Get UserId from cognito session
    //and fetcing the new list if the present list is stale
    if (!this.props.consistency.isConsistent) {
      Auth.currentUserInfo().then((result) => {
        this.fetchEvents(result.username);
      });
    }
  };

  render() {
    return (
      <div>
        {this.props.consistency.isConsistent && (
          <EventContainer {...this.props} />
        )}
      </div>
    );
  }
}
