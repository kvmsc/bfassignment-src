import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import UpdateEvent from "./components/UpdateEvent";
import CreateEvent from "./components/CreateEvent";
import { withAuthenticator } from "aws-amplify-react";
import Amplify from "aws-amplify";
import config from "./config";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: config.api.NAME,
        endpoint: config.api.ENDPOINT,
      },
    ],
  },
});

class App extends Component {
  //State Variables and Helper FUnctions
  state = {
    isConsistent: false,
    eventList: null,
  };

  setEventList = (_eventList) => {
    this.setState({ eventList: _eventList ? _eventList : [] });
  };

  setConsistency = (_isConsistent) => {
    this.setState({ isConsistent: _isConsistent });
  };

  render() {
    const consistencyProp = {
      isConsistent: this.state.isConsistent,
      setConsistency: this.setConsistency,
    };

    const eventProp = {
      eventList: this.state.eventList,
      setEventList: this.setEventList,
    };

    return (
      <div className="App">
        <Router>
          <div>
            <Navbar />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Home
                    {...props}
                    events={eventProp}
                    consistency={consistencyProp}
                  />
                )}
              />

              <Route
                exact
                path="/UpdateEvent"
                render={(props) => (
                  <UpdateEvent {...props} consistency={consistencyProp} />
                )}
              />

              <Route
                exact
                path="/CreateEvent"
                render={(props) => (
                  <CreateEvent {...props} consistency={consistencyProp} />
                )}
              />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default withAuthenticator(App, {
  signUpConfig: {
    hiddenDefaults: ["phone_number"],
  },
});
