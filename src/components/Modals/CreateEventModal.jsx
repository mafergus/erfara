import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from '../../actions/database';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { grey100, lightBlack, darkBlack } from 'material-ui/styles/colors';
import autoBind from 'react-autobind';
import { addAuthedUser, addUser } from "../../actions/userActions";
import TextField from "material-ui/TextField";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import store from "../../store/store";
import { addEvent } from "../../actions/eventActions";
import { getPhoto } from "../../utils/Api";

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
    const email = error.email;
    const credential = error.credential;
    console.log(type, " errorCode: ", errorCode, " errorMessage: ", errorMessage);
  }

  addNewEvent() {
    const { name, description, timestamp, locationString, uploadFile } = this;
    const { userId, onRequestClose } = this.props;
    const searchTerm = name.split(" ")[0];
    debugger;
    if (!this.props.userId) { return; }
    getPhoto(searchTerm, 
      blob => {
        debugger;
        uploadFile(blob, name, description, timestamp, locationString, userId);
      }, 
      () => {
        debugger;
        store.dispatch(addEvent(name, description, PLACEHOLDER_PHOTO, timestamp, locationString, userId));
        onRequestClose();
      }
    );
  }

  uploadFile(file, name, description, timestamp, locationString, userId) {
    const { onRequestClose } = this.props;
    var storageRef = firebase.storage().ref();
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + new Date().getTime()).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
      store.dispatch(addEvent(name, description, PLACEHOLDER_PHOTO, timestamp, locationString, userId));
      onRequestClose();
    }, function() {
      // Upload completed successfully, now we can get the download URL
      const downloadURL = uploadTask.snapshot.downloadURL;
      store.dispatch(addEvent(name, description, downloadURL, timestamp, locationString, userId));
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
    const { title } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onRequestClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.addNewEvent}
      />,
    ];

    return (
        <Dialog
          actions={actions}
          contentStyle={{textAlign: "center", width: "60%", height: "500px"}}
          title={"Create Event"}
          titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: darkBlack }}
          modal={false}
          onRequestClose={this.props.onRequestClose}
          open={this.props.isOpen}>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <TextField
              hintText="Event Name"
              floatingLabelText="Event Name"
              onChange={(event, value) => { this.name = value; }}
            />
            <TextField
              hintText="Description"
              floatingLabelText="Description"
              onChange={(event, value) => { this.description = value; }}
            />
            <DatePicker hintText="Date" onChange={this.dateChange} />
            <TimePicker hintText="12hr Format" onChange={this.timeChange} />
            <TextField
              hintText="Location"
              floatingLabelText="Location"
              onChange={(event, value) => { this.locationString = value; }}
            />
          </div>
        </Dialog>
    );
  }
}

export default connect(mapStateToProps)(CreateEventModal);
