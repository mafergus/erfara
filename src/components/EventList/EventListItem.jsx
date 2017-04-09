import React, { PropTypes } from "react";
import autoBind from "react-autobind"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { getUser } from "actions/userActions";
import Attendees from "components/EventList/Attendees";
import DateBox from "components/DateBox";
import { Col } from "react-bootstrap";

function mapStateToProps(state, props) {
  const event = state.events.get(props.eventUid);
  return {
    event,
    attendees: event && Object.keys(event.attendees).map(userId => state.users.get(userId)),
    user: event && state.users.get(event.userId),
    users: Object.keys(state.users),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class EventListItem extends React.Component {

  static propTypes = {
    attendees: PropTypes.array.isRequired,
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
    getUser: PropTypes.func.isRequired,
    muiTheme: PropTypes.any,
    isFeatured: PropTypes.bool,
    popUp: PropTypes.bool,
    itemStyle: PropTypes.object,
    mouseOver: PropTypes.func,
    mouseOut: PropTypes.func,
    marginConstant:PropTypes.number,
    $geoService: PropTypes.object,
    users: PropTypes.array,
  };

  static defaultProps = {
    isFeatured: false,
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { event, getUser, users } = this.props;
    if (event && !users.includes(event.userId)) {
      getUser(event.userId);
    }
  }

  renderEventDetails() {
    const { event, attendees, isFeatured, muiTheme, popUp } = this.props;
    const timestamp = new Date(event.date);

    return <div style={{ width: "100%", height: popUp ? 40 : 70, marginTop: -5, position: "relative", display: "flex", alignItems: "center", backgroundColor: "white" }}>
      <DateBox style={{height: popUp ? 40 : 70 }} muiTheme={muiTheme.palette.accent1Color} timestamp={timestamp} />
      <div style={{ height: "100%", flexGrow: "1", display: "flex", alignItems: "center", paddingLeft: 13 }}>
        <p style={{ color: "#424242", textAlign: "left" }}>
          <span style={{ fontSize: "1em" }}>{event.title}</span>
          <br/>
          <span style={{ fontSize: "0.8em" }}>Fri 8PM &nbsp; &#8226; &nbsp; {event.locationString}</span>
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Attendees attendees={attendees} extended={isFeatured} />
      </div>
    </div>;
  }

  render() {
    const { event, eventUid, isFeatured, itemStyle, popUp, mouseOver, mouseOut, marginConstant } = this.props;
    const STYLE = {
      marginTop: popUp ? -50 : 0,
      marginLeft: popUp ? 50+(-380*marginConstant) : 0,
      marginBottom: 25,
      paddingRight: 20,
      position: popUp ? 'absolute' : 'relative',
      zIndex: popUp ? 999999 : 0,
      height: popUp ? 70 : 250,
      ...itemStyle,
    };
    return <Col
        md={12}
        lg={isFeatured ? 12 : 6}
        onMouseOver={popUp ? mouseOver : null}
        onMouseOut={popUp ? mouseOut : null}
        style={STYLE}
      >
      <Link to={`/event/${eventUid}`} style={{ textDecoration: "none" }} className="no-padding">
        <div className="hoverable shadow">
          <img src={event.photo} alt="Event" style={{ width: "100%", height: popUp ? 120 : 181, objectFit: "cover" }} />       
          {this.renderEventDetails()}
        </div>
      </Link>
      </Col>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListItem);