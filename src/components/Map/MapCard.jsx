import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { fetchUser } from "utils/Api";
import { addUser } from "actions/userActions";
import Attendees from "components/EventList/Attendees";
import DateBox from "components/DateBox";
import { Col } from 'fluid-react';

function mapStateToProps(state, props) {
  const event = state.events.get(props.eventUid);
  return {
    event,
    attendees: event && Object.keys(event.attendees).map(userId => state.users.get(userId)),
    user: event && state.users.get(event.userId),
    users: state.users.keySeq().toArray(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addUser }, dispatch);
}

export class MapCard extends React.Component {

  static propTypes = {
    attendees: PropTypes.array.isRequired,
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
    addUser: PropTypes.func.isRequired,
    itemStyle: PropTypes.object,
    mouseOver: PropTypes.func,
    mouseOut: PropTypes.func,
    marginConstant: PropTypes.number,
    user: PropTypes.object,
    users: PropTypes.array.isRequired,
  };

  static defaultProps = {
    itemStyle: {},
    mouseOver: null,
    mouseOut: null,
    marginConstant: 0,
    user: null,
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { event, addUser, users } = this.props;
    if (event && !users.includes(event.userId)) {
      fetchUser(event.userId).then(snap => {
        const user = snap.val();
        if (user) { addUser(user); }
      });
    }
  }

  renderEventDetails() {
    const { event, attendees, user } = this.props;
    const timestamp = new Date(event.date);
    // const startTime = new Moment(event.startTime);
    // const date = new Moment(event.date);
    const locationString = `hosted by ${user ? user.name : "Deleted User"} \xa0\xa0 \u25CF \xa0\xa0 ${event.geoCoordinates.neighborhood}, ${event.geoCoordinates.city}`;

    return (
      <div
        style={{ 
          width: "100%",
          height: 40,
          marginTop: -5,
          position: "relative",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white" 
        }}
      >
        <DateBox style={{height: 40 }} timestamp={timestamp} />
        <div style={{ height: "100%", flexGrow: "1", display: "flex", alignItems: "center", paddingLeft: 13 }}>
          <p style={{ color: "#424242", textAlign: "left", verticalAlign: "top" }}>
            <span style={{ fontSize: "1em" }}>{event.title}</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Attendees attendees={attendees} imageStyle={{ height: 20, width: 20 }} />
        </div>
      </div>
    );
  }

  render() {
    const { event, eventUid, itemStyle, mouseOver, mouseOut, marginConstant, user } = this.props;
    const STYLE = {
      marginTop: -50,
      marginLeft: 50 + -380 * marginConstant,
      marginBottom: 25,
      paddingRight: 20,
      position: 'absolute',
      zIndex: 999999,
      height: 70,
      width: 300,
      ...itemStyle,
    };
    const EVENT_CREATOR_IMG = {
      position: "absolute",
      width: 40,
      height: 40,
      top: 8,
      right: 9,
      borderRadius: "50%",
      border: "2px solid white",
    };
    const IMG_STYLE = {
      width: "100%",
      position: "relative",
      height: 120,
      backgroundImage: `url(${event.photo})`,
      backgroundPosition: "50% 50%",
      backgroundSize: "cover",
    };
    return (
      <div
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        style={STYLE}
      >
        <Link to={`/event/${eventUid}`} style={{ textDecoration: "none" }} className="no-padding">
          <div className="shadow">
            <div style={IMG_STYLE}>
              <div className="image-overlay" />
              <img
                src={user && user.photo}
                alt="Event creator"
                style={EVENT_CREATOR_IMG}
              />
            </div>
            {this.renderEventDetails()}
          </div>
        </Link>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapCard);