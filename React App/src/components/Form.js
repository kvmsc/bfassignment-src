import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { API, Auth } from "aws-amplify";

export default class FormComp extends Component {
  //Constructing props to bind 'this' to submit Handler
  constructor(props) {
    super(props);
    this.state = {
      userIdfound: false,
      formSubmitted: false,
      formChanged: false,

      formData: {
        user_id: "",
        timestamp: this.props.update_data
          ? this.props.update_data.EventTimestamp
          : "",
        name: this.props.update_data ? this.props.update_data.EventName : "",
        description: this.props.update_data
          ? this.props.update_data.EventDescription
          : "",
        status: this.props.update_data
          ? this.props.update_data.EventStatus
          : "",
        start_date: this.props.update_data
          ? this.props.update_data.EventSchedule.Start_time.slice(-10)
          : "",
        start_time: this.props.update_data
          ? this.props.update_data.EventSchedule.Start_time.slice(0, -11)
          : "",
        end_date: this.props.update_data
          ? this.props.update_data.EventSchedule.Stop_time.slice(-10)
          : "",
        end_time: this.props.update_data
          ? this.props.update_data.EventSchedule.Stop_time.slice(0, -11)
          : "",
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount = () => {
    if (!this.state.userIdfound) {
      Auth.currentUserInfo().then((result) => {
        let updatedFormData = { ...this.state.formData };
        updatedFormData.user_id = result.username;
        this.setState({ formData: updatedFormData, userIdfound: true });
      });
    }
  };

  postForm = async () => {
    try {
      const apiName = "event-scheduler-api";
      const path = this.props.reqPath;
      const myInit = {
        body: {
          item: {
            UserId: this.state.formData.user_id,
            EventTimestamp: this.state.formData.timestamp,
            EventName: this.state.formData.name,
            EventDescription: this.state.formData.description,
            EventStatus: this.state.formData.status,
            EventSchedule: {
              Start_time:
                this.state.formData.start_time +
                " " +
                this.state.formData.start_date,
              Stop_time:
                this.state.formData.end_time +
                " " +
                this.state.formData.end_date,
            },
          },
        },
      };
      console.log(myInit);
      const response = await API.post(apiName, path, myInit);

      //Logging  The response
      console.log(response);

      //the data in App State is now Stale
      this.props.consistency.setConsistency(false);
      //console.log(this.props.consistency.isConsistent);
    } catch (err) {
      console.log(err);
    }
  };

  handleChange(event) {
    //console.log(this.state.formData.name);
    let updatedFormData = { ...this.state.formData };
    updatedFormData[event.target.name] = event.target.value;
    this.setState({ formData: updatedFormData, formChanged: true });
    //console.log(this.state.formData.name);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.formChanged) {
      this.postForm().then(() => {
        this.setState({ formSubmitted: true });
      });
    } else {
      alert("Update Form to Submit");
    }
  }

  render() {
    if (this.state.formSubmitted) {
      return <Redirect to="/" />;
    }

    const {
      user_id,
      timestamp,
      name,
      description,
      status,
      start_date,
      start_time,
      end_date,
      end_time,
    } = this.state.formData;

    return (
      <div className="container contact-form">
        <form onSubmit={this.handleSubmit}>
          <h3>{this.props.formType} Event!</h3>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  placeholder="Event Name"
                  disabled={this.props.formType === "Update"}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  value={description}
                  className="form-control"
                  placeholder="Event Description"
                  onChange={this.handleChange}
                  disabled={this.props.formType === "Update"}
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="start_date">Start Date:</label>
                <input
                  className="form-control"
                  type="date"
                  name="start_date"
                  value={start_date}
                  onChange={this.handleChange}
                  id="start_date"
                />
              </div>

              <div className="form-group">
                <label htmlFor="start_time">Start Time:</label>
                <input
                  className="form-control"
                  type="time"
                  name="start_time"
                  value={start_time}
                  onChange={this.handleChange}
                  id="start_time"
                />
              </div>
            </div>

            <div className="col-6">
              <div className="form-group">
                <label htmlFor="end_date">End Date:</label>
                <input
                  className="form-control"
                  type="date"
                  name="end_date"
                  value={end_date}
                  onChange={this.handleChange}
                  id="end_date"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_time">End Time:</label>
                <input
                  className="form-control"
                  type="time"
                  name="end_time"
                  value={end_time}
                  onChange={this.handleChange}
                  id="end_time"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="select">Status:</label>
                <select
                  className="custom-select"
                  name="status"
                  value={status}
                  onChange={this.handleChange}
                  required
                  id="select"
                >
                  <option value="">Select One</option>
                  <option value="Idle">Idle</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="submit"
                  className="btnContact"
                  value={this.props.formType}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
