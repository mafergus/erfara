import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import autoBind from 'react-autobind';
import TextField from "material-ui/TextField";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import store from "store/store";
import { addEvent } from "actions/eventActions";
import { getPhoto, uploadFile } from "utils/Api";
import "components/Modals/CreateEventModal.css"

const PLACEHOLDER_PHOTO = "http://files.parsetfss.com/a5e80e30-a275-49f2-989e-e218e12017db/tfss-02ed6157-7aa6-4ffa-b530-16f711fb8f59-muir-woods.jpg";

function mapStateToProps(state) {
  return {
    userId: state.authedUser && state.authedUser.uid,
  };
}

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export class CreateEventModal extends React.Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    userId: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);

    this.timestamp = new Date();
  }

  onError(error, type) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(type, " errorCode: ", errorCode, " errorMessage: ", errorMessage);
  }

  addNewEvent() {
    const { name, description, timestamp, locationString } = this;
    const { userId, onRequestClose } = this.props;
    const searchTerm = name.split(" ")[0];
    if (!this.props.userId) { return; }

    getPhoto(searchTerm)
    .then(blob => {
      return uploadFile(blob);
    })
    .then(url => {
      store.dispatch(addEvent(name, description, url, timestamp, locationString, userId));
      onRequestClose();
    })
    .catch(error => {
      store.dispatch(addEvent(name, description, PLACEHOLDER_PHOTO, timestamp, locationString, userId));
      onRequestClose();
    });
  }

  dateChange(placeholder, date) {
    this.timestamp.setFullYear(date.getFullYear());
    this.timestamp.setMonth(date.getMonth());
    this.timestamp.setDate(date.getDate());
  }

  timeChange(placeholder, date) {
    this.timestamp.setHours(date.getHours());
    this.timestamp.setMinutes(date.getMinutes());
  }

  render() {
    const style = {
      hintStyle: {
        color: "#BDBDBD", 
        fontFamily: ".AppleSystemUIFont",
        fontSize: "12px"
      },
      descriptionHintStyle: {
        color: "#BDBDBD", 
        fontFamily: ".AppleSystemUIFont",
        fontSize: "12px",
        top: "12px"
      },
      textFieldStyle: {
        paddingLeft:"10px",
        width: "inherit",
        fontSize:"12px"
      }
    }

    return (
      <div className="popup-dialog">
        <Dialog
          contentStyle={{width: "55%", minWidth:"660px"}}
          modal={false}
          onRequestClose={this.props.onRequestClose}
          open={this.props.isOpen}>
          <div>
            <a href="#" onClick={this.props.onRequestClose} className="close-btn">&times;</a>
            <h3>Create an Event</h3>
            <div className="row-1">
              <div className="event-title">
                <div className="label">
                  <label>Event Title</label>
                </div>
                <div className="box">
                  <TextField
                    name="title"
                    hintText="Give your event a short name"
                    hintStyle={style.hintStyle}
                    underlineShow={false}
                    style={style.textFieldStyle}
                    onChange={(event, value) => { this.name = value; }}
                  />
                </div>
              </div>
              <div className="event-location">
              <div className="label">
                <label>Location</label>
              </div>
              <div className="box">
                <TextField
                  name="location"
                  hintText="Add a place or address"
                  hintStyle={style.hintStyle}
                  underlineShow={false}
                  style={style.textFieldStyle}
                  onChange={(event, value) => { this.locationString = value; }}
                />
              </div>
              </div>
            </div>
            <div className="row-2">
              <div className="event-date">
                <div className="label">
                  <label>Date</label>
                </div>
                <div className="box box-small">
                  <DatePicker 
                    name="date"
                    hintText="7/23/17"
                    hintStyle={style.hintStyle}
                    textFieldStyle={style.textFieldStyle}
                    underlineShow={false} 
                    onChange={this.dateChange} />
                </div>
              </div>
              <div className="start-time">
                <div className="label">
                  <label>Start Time</label>
                </div>
                <div className="box box-small">
                  <TimePicker 
                    name="startTime"
                    hintText="4:00 PM"
                    hintStyle={style.hintStyle}
                    textFieldStyle={style.textFieldStyle}
                    underlineShow={false}  
                    onChange={this.timeChange} />
                </div>
              </div>
              <div className="end-time">
                <div className="label">
                  <label>End Time</label>
                </div>
                <div className="box box-small">
                  <TimePicker 
                    name="endTime"
                    hintText="5:00 PM"
                    hintStyle={style.hintStyle}
                    textFieldStyle={style.textFieldStyle}
                    underlineShow={false}  
                    onChange={this.timeChange} />
                </div>
              </div>
              <div className="event-info">
                <div className="label">
                  <label>What should invitees bring?</label>
                </div>
                <div className="box">
                  <TextField
                    name="info"
                    hintText="i.e. water bottle, comfortable shoes"
                    hintStyle={style.hintStyle}
                    style={style.textFieldStyle}
                    underlineShow={false}
                  />
                </div>
              </div>
            </div>
            <div className="row-3">
              <div className="event-description" >
                <div className="label">
                  <label>Event Description</label>
                </div>
                <div className="box box-big">
                  <TextField
                    name="description"
                    hintText="Give more detail so people know what your event is about"
                    hintStyle={style.descriptionHintStyle}
                    style={style.textFieldStyle}
                    underlineShow={false}
                    multiLine={true}
                    rows={3}
                    rowsMax={3}
                    onChange={(event, value) => { this.description = value; }}
                  />
                </div>
              </div>
            </div>
            <div className="row-4">
              <button type='submit' className="create-btn" onClick={() => {this.addNewEvent()}}>CREATE</button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CreateEventModal);
