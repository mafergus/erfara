import React, { PropTypes } from "react";
import autoBind from "react-autobind"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { GridTile } from 'material-ui/GridList';
import Face from 'material-ui/svg-icons/action/face';
import IconButton from 'material-ui/IconButton';
import { white, lightBlack } from "material-ui/styles/colors";
import { getUser } from "actions/userActions";
import { darkGray } from "utils/colors";
import { getShortMonth } from "utils/dateTimeHelpers";

function mapStateToProps(state, props) {
  const event = state.events.get(props.eventUid);
  return {
    event,
    attendees: event && Object.keys(event.attendees).map(userId => state.users.get(userId)),
    user: event && state.users.get(event.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class EventListItem extends React.Component {

  static PropTypes = {
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
    isFeatured: PropTypes.bool,
  };

  static defaultProps = {
    isFeatured: false,
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { event, getUser } = this.props;
    if (event) {
      getUser(event.userId);
    }
  }

  renderAttendees(count) {
    const { event, isFeatured, attendees } = this.props;
    if (count > 1) {
      if (isFeatured && attendees) {
        return attendees.map(user => <img style={{ height: 26, width: 26, borderRadius: "50%", objectFit: "cover" }} src={user.photo}/>);
      } else {
        return <div style={{ height: 29, width: 29, borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.12)", display: "inline-block", marginLeft: 8 }}>
          <span style={{ color: lightBlack, verticalAlign: "middle", fontSize: "0.8em" }}>{`+${count-1}`}</span>
        </div>;
      }
    }
  }

  renderDate(timestamp) {
    const { muiTheme } = this.props;
    return <div style={{ height: "100%", width: 70, display: "inline-block", borderRight: "1px solid rgba(0, 0, 0, 0.06)" }}>
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <p style={{ fontSize: "0.8em", fontWeight: "300", color: muiTheme.palette.accent1Color }}>{getShortMonth(timestamp)}</p>
          <p style={{ fontSize: "1.1em", fontWeight: "200", color: muiTheme.palette.accent1Color }}>{timestamp.getDate()}</p>
        </div>
      </div>
    </div>;
  }

  renderEventDetails() {
    const { event, user } = this.props;
    const timestamp = new Date(event.date);
    return <div style={{ width: "100%", height: 70, marginTop: -5, position: "relative", display: "flex", alignItems: "center", backgroundColor: "white" }}>
      {this.renderDate(timestamp)}
      <div style={{ height: "100%", flexGrow: "1", display: "flex", alignItems: "center", paddingLeft: 13 }}>
        <p style={{ color: "#424242", textAlign: "left" }}>
          <span style={{ fontSize: "1em" }}>{event.title}</span>
          <br/>
          <span style={{ fontSize: "0.8em" }}>Fri 8PM &nbsp; &#8226; &nbsp; {event.locationString}</span>
        </p>
      </div>
      <div style={{ paddingRight: 15, display: "flex", alignItems: "center" }}>
        <img style={{ height: 26, width: 26, borderRadius: "50%", objectFit: "cover" }} src={user.photo}/>
        {this.renderAttendees(Object.keys(event.attendees).length)}
      </div>
    </div>;
  }

  render() {
    const { event, eventUid, muiTheme, isFeatured } = this.props;
    return <Link to={`/event/${eventUid}`} style={{ textDecoration: "none" }}>
      <div style={{ width: isFeatured ? 720 : 333, height: 250 }} className="shadow border">
        <img src={event.photo} alt="Event" style={{ width: "100%", height: 181, objectFit: "cover" }} />
        {this.renderEventDetails()}
      </div>
    </Link>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListItem);