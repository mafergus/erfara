import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import autoBind from 'react-autobind';
import TextField from "material-ui/TextField";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import { addEvent, getPhoto, uploadFile } from "utils/Api";
import "components/Modals/CreateEventModal.scss";
import { Row, Col } from "react-bootstrap";
import GooglePlacesSuggest from "components/GooglePlacesSuggest";

const PLACEHOLDER_PHOTO = "http://files.parsetfss.com/a5e80e30-a275-49f2-989e-e218e12017db/tfss-02ed6157-7aa6-4ffa-b530-16f711fb8f59-muir-woods.jpg";

const FONT_SIZE = "0.9em";

const TEXTFIELD_STYLE = {
  paddingLeft: 10,
  width: "inherit",
  fontSize: FONT_SIZE,
};

const HINT_STYLE = {
  fontSize: FONT_SIZE,
};

const items = [];
items.push(<MenuItem value={items.length} key="30min" primaryText="30 mins" />);
items.push(<MenuItem value={items.length} key="1hr" primaryText="1 hr" />);
items.push(<MenuItem value={items.length} key="130hr" primaryText="1:30 hrs" />);
items.push(<MenuItem value={items.length} key="2hr" primaryText="2 hrs" />);
items.push(<MenuItem value={items.length} key="230hr" primaryText="2:30 hrs" />);
items.push(<MenuItem value={items.length} key="3hrs" primaryText="3 hrs" />);

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser || null,
  };
}

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export class CreateEventModal extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    const startTime = new Date();
    startTime.setMinutes(0);
    startTime.setHours((startTime.getHours() + 1) % 24);

    this.state = {
      isLoading: false,
      location: null,
      geoCoords: {},
      durationItem: 1,
      hintColor: "#BDBDBD",
      date: new Date(),
      time: startTime,
      toBring: "",
    };
  }

  addNewEvent() {
    const { name, description } = this;
    const { authedUser, onRequestClose } = this.props;
    const { location, geoCoords, date, time, toBring } = this.state;

    if (!this.validateInput()) {
      this.setState({ hintColor: "red" });
      return;
    }

    this.setState({ isLoading: true });
    const searchTerm = name.split(" ")[0];
    getPhoto(searchTerm)
    .then(blob => uploadFile(blob))
    .then(url => {
      addEvent(name, description, url, date, time, this.getEndTime(time),
        toBring, location.description, authedUser.uid, geoCoords);
      this.setState({ isLoading: false });
      onRequestClose();
    })
    .catch(() => {
      addEvent(name, description, PLACEHOLDER_PHOTO, date, time, this.getEndTime(time),
        toBring, location.description, authedUser.uid, geoCoords);
      this.setState({ isLoading: false });
      onRequestClose();
    });
  }

  getEndTime() {
    let durationTime = 0;
    const { time, durationItem } = this.state;
    switch (durationItem) {
      case 0: { durationTime = 30; break; }
      case 1: { durationTime = 60; break; }
      case 2: { durationTime = 90; break; }
      case 3: { durationTime = 120; break; }
      case 4: { durationTime = 150; break; }
      case 5: { durationTime = 180; break; }
      default: { durationTime = 60; break; }
    }
    const newTime = new Date(time.getTime());
    newTime.setMinutes(newTime.getMinutes() + durationTime);
    return newTime;
  }

  validateInput() {
    const { name, description } = this;
    const { location } = this.state;

    return name && description && location;
  }

  renderSubmitButton() {
    const { authedUser, onRequestClose } = this.props;
    if (authedUser) {
      if (this.state.isLoading) {
        return <CircularProgress />;
      }

      return <RaisedButton 
          label="CREATE"
          className="create-btn"
          onTouchTap={() => { this.addNewEvent(); }}
          primary
        />;
    }

    return <RaisedButton 
        label="LOG IN"
        className="create-btn"
        onTouchTap={() => onRequestClose()}
        primary
      />;
  }

  renderTitle() {
    return <div>
      <h4 className="title-label">Event Title</h4>
      <div className="box">
        <TextField
          name="title"
          hintText="Give your event a short name"
          hintStyle={{ HINT_STYLE, color: this.state.hintColor }}
          underlineShow={false}
          style={TEXTFIELD_STYLE}
          onChange={(event, value) => { this.name = value; }}
        />
      </div>
    </div>;
  }

  renderLocation() {
    return <div>
      <h4 className="title-label">Location</h4>
      <div className="box">
        <GooglePlacesSuggest
          fontSize={FONT_SIZE}
          hintStyle={{ HINT_STYLE, color: this.state.hintColor }}
          onSelectSuggest={(location, geoCoords) => this.setState({ location, geoCoords })}
        />
      </div>
    </div>;
  }

  renderDate() {
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);

    return <div className="event-date">
      <h4 className="title-label">Date</h4>
      <div className="box box-small">
        <DatePicker 
          name="date"
          hintText="7/23/17"
          hintStyle={{ HINT_STYLE, color: this.state.hintColor }}
          minDate={minDate}
          textFieldStyle={TEXTFIELD_STYLE}
          underlineShow={false} 
          onChange={(placeholder, date) => this.setState({ date })}
          value={this.state.date}
          formatDate={new Intl.DateTimeFormat('en-US', {
            day: "numeric",
            month: "short",
          }).format}
        />
      </div>
    </div>;
  }

  renderStartTime() {

    return <div className="start-time">
      <h4 className="title-label">Start Time</h4>
      <div className="box box-small">
        <TimePicker 
          name="startTime"
          value={this.state.time}
          hintStyle={{ HINT_STYLE, color: this.state.hintColor }}
          textFieldStyle={TEXTFIELD_STYLE}
          underlineShow={false}  
          onChange={(event, time) => this.setState({ time })} />
      </div>
    </div>;
  }

  renderEndTime() {
    const endTime = new Date();
    endTime.setHours((endTime.getHours() + 2) % 24);
    endTime.setMinutes(0);

    return <div className="end-time">
      <h4 className="title-label">Length</h4>
      <div className="box box-small">
        <DropDownMenu
          style={{ width: "100%", marginTop: -4 }}
          labelStyle={{ paddingLeft: 10, paddingRight: 5, fontSize: FONT_SIZE }}
          iconStyle={{ right: 0, paddingRight: 0, paddingLeft: 0, width: 24 }}
          maxHeight={300}
          value={this.state.durationItem}
          onChange={(event, index, value) => this.setState({ durationItem: value })}
          underlineStyle={{ display: "none" }}
        >
          {items}
        </DropDownMenu>
      </div>
    </div>;
  }

  renderToBring() {
    return <div>
      <h4 className="title-label">What should invitees bring?</h4>
      <div className="box">
        <TextField
          name="info"
          hintText="i.e. water bottle, comfortable shoes"
          hintStyle={HINT_STYLE}
          style={TEXTFIELD_STYLE}
          underlineShow={false}
          onChange={(event, value) => this.setState({ toBring: value })}
        />
      </div>
    </div>;
  }

  render() {
    const { authedUser, isOpen, onRequestClose } = this.props;
    if (!authedUser) { return null; }

    return (
      <div className="popup-dialog">
        <Dialog
          contentStyle={{ width: "100%" }}
          modal={false}
          onRequestClose={onRequestClose}
          open={isOpen}
          autoScrollBodyContent>
          <div>
            <a
              href="#"
              onTouchTap={() => { this.props.onRequestClose(); this.setState({ isLoading: false }); }}
              className="close-btn"
              style={{ textDecoration: "none" }}
            >
              &times;
            </a>
            <h3 style={{ marginBottom: "1.5em" }}>Create an Event</h3>
            <Row>
              <Col xs={12} sm={6} className="margin-bottom">{this.renderTitle()}</Col>
              <Col xs={12} sm={6} className="margin-bottom">{this.renderLocation()}</Col>
            </Row>
            <Row>
              <Col xs={4} sm={2} className="margin-bottom">{this.renderDate()}</Col>
              <Col xs={4} sm={2} className="margin-bottom">{this.renderStartTime()}</Col>
              <Col xs={4} sm={2} className="margin-bottom">{this.renderEndTime()}</Col>
              <Col xs={12} sm={6} className="margin-bottom">{this.renderToBring()}</Col>
            </Row>
            <div className="row-3">
              <div className="event-description" >
                <h4 className="title-label">Event Description</h4>
                <div className="box box-big">
                  <TextField
                    name="description"
                    hintText="Give more detail so people know what your event is about"
                    hintStyle={{ HINT_STYLE, top: 12, color: this.state.hintColor }}
                    style={TEXTFIELD_STYLE}
                    underlineShow={false}
                    multiLine
                    rows={3}
                    rowsMax={3}
                    onChange={(event, value) => { this.description = value; }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 25 }}>
              {this.renderSubmitButton()}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CreateEventModal);
