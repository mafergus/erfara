import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import store from "store/store";
import Dialog from 'material-ui/Dialog';
import autoBind from 'react-autobind';
import TextField from "material-ui/TextField";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import { addEvent } from "utils/Api";
import { getPhoto, uploadFile } from "utils/Api";
import SearchBox from 'components/Modals/LocationSearch';
import "components/Modals/CreateEventModal.css";

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
    isLoading: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    userId: PropTypes.string,
    locationFromSearchBox: PropTypes.string,
    geoLocationFromSearchBox: PropTypes.object
  };

  constructor() {
    super();
    autoBind(this);

    this.state = { isLoading: false, locationFromSearchBox: "", geoLocationFromSearchBox: {} };
    this.dateStamp = new Date();
    this.startTimeStamp = new Date();
    this.endTimeStamp = new Date();
  }

  addNewEvent() {
    const { name, description, dateStamp, startTimeStamp, endTimeStamp, advices } = this;
    const { userId, onRequestClose } = this.props;
    const locationString = this.state.locationFromSearchBox;
    const geoLocation = this.state.geoLocationFromSearchBox;

    if (!this.props.userId) { 
      this.disabledProgressCircle();
      return;
    }

    if(!name || !description || !advices || !locationString) {
      setTimeout( () => { this.disabledProgressCircle(); }, 2000 );
      alert("Please fill all fields");
      return;
    } else {
      const searchTerm = name.split(" ")[0];
      getPhoto(searchTerm)
      .then(blob => {
        return uploadFile(blob);
      })
      .then(url => {
        store.dispatch(addEvent(name, description, url, dateStamp, startTimeStamp, endTimeStamp, advices, locationString, userId, geoLocation));
        this.disabledProgressCircle();
        onRequestClose();
      })
      .catch(() => {
        store.dispatch(addEvent(name, description, PLACEHOLDER_PHOTO, dateStamp, startTimeStamp, endTimeStamp, advices, locationString, userId, geoLocation));
        this.disabledProgressCircle();
        onRequestClose();
      });
    }
  }
  locationChange(location, geoLocation) {
    this.setState({locationFromSearchBox: location, geoLocationFromSearchBox: geoLocation});
  }

  dateChange(placeholder, date) {
    this.dateStamp.setFullYear(date.getFullYear());
    this.dateStamp.setMonth(date.getMonth());
    this.dateStamp.setDate(date.getDate());
  }

  startTimeChange(placeholder, date) {
    this.startTimeStamp.setHours(date.getHours());
    this.startTimeStamp.setMinutes(date.getMinutes());
  }

  endTimeChange(placeholder, date) {
    this.endTimeStamp.setHours(date.getHours());
    this.endTimeStamp.setMinutes(date.getMinutes());
  }

  disabledProgressCircle() {
    this.setState( {isLoading: false} );
  }


  renderProgressCircle() {
    if(this.props.userId){
      if(this.state.isLoading) {
        return ( 
          <div>
            <CircularProgress />
          </div> 
        );
      }
      return (
        <RaisedButton 
          label="CREATE"
          primary={true}
          className="create-btn"
          onClick={() => { this.setState({ isLoading: true }); this.addNewEvent(); }}
        />
      );   
    }
    else {
      return (
        <RaisedButton 
          label="LOG IN"
          primary={true}
          className="create-btn"
          onClick={ () => { this.props.onRequestClose(); }}
        />
      )
    }
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
      },
      errorText: {
        marginTop: "10px"
      }
    }

    const startTime = new Date();
    startTime.setMinutes(0);
    startTime.setHours((startTime.getHours() + 1) % 24);
    const endTime = new Date();
    endTime.setHours((endTime.getHours() + 2) % 24);
    endTime.setMinutes(0);

    return (
      <div className="popup-dialog">
        <Dialog
          contentStyle={{width: "55%", minWidth:"660px"}}
          modal={false}
          onRequestClose={this.props.onRequestClose}
          open={this.props.isOpen}>
          <div>
            <a href="#" onClick={() => { this.props.onRequestClose(); this.setState({ isLoading: false }); }} className="close-btn">&times;</a>
            <h3 style={{ marginBottom: "1.5em" }}>Create an Event</h3>
            <div className="row-1">
              <div className="event-title">
                <div className="title-label">
                  <p>Event Title</p>
                </div>
                <div className="box">
                  <TextField
                    name="title"
                    hintText="Give your event a short name"
                    hintStyle={style.hintStyle}
                    underlineShow={false}
                    style={style.textFieldStyle}
                    onChange={(event, value) => { this.name = value;}}
                  />
                </div>
              </div>
              <div className="event-location">
                <div className="title-label">
                  <p>Location</p>
                </div>
                <div className="box">
                  <SearchBox onSelectLocation={this.locationChange}/>
                </div>
              </div>
            </div>
            <div className="row-2">
              <div className="event-date">
                <div className="title-label">
                  <p>Date</p>
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
                <div className="title-label">
                  <p>Start Time</p>
                </div>
                <div className="box box-small">
                  <TimePicker 
                    name="startTime"
                    hintText="4:00 PM"
                    defaultTime={startTime}
                    hintStyle={style.hintStyle}
                    textFieldStyle={style.textFieldStyle}
                    underlineShow={false}  
                    onChange={this.startTimeChange} />
                </div>
              </div>
              <div className="end-time">
                <div className="title-label">
                  <p>End Time</p>
                </div>
                <div className="box box-small">
                  <TimePicker 
                    name="endTime"
                    defaultTime={endTime}
                    hintText="5:00 PM"
                    hintStyle={style.hintStyle}
                    textFieldStyle={style.textFieldStyle}
                    underlineShow={false}  
                    onChange={this.endTimeChange} />
                </div>
              </div>
              <div className="event-info">
                <div className="title-label">
                  <p>What should invitees bring?</p>
                </div>
                <div className="box">
                  <TextField
                    name="info"
                    hintText="i.e. water bottle, comfortable shoes"
                    hintStyle={style.hintStyle}
                    style={style.textFieldStyle}
                    underlineShow={false}
                    onChange={(event, value) => { this.advices = value; }}
                  />
                </div>
              </div>
            </div>
            <div className="row-3">
              <div className="event-description" >
                <div className="title-label">
                  <p>Event Description</p>
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
              {this.renderProgressCircle()}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CreateEventModal);
