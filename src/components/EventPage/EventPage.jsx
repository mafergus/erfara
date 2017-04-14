import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import EventDetails from "components/EventPage/EventDetails";
import UserList from "components/UserList";
import { getEvent } from "actions/eventActions";
import { joinEvent, leaveEvent } from "utils/Api";
import EventHero from "components/EventPage/EventHero";
import Feed from "components/Feed/Feed";
import Attendees from "components/EventList/Attendees";
import { erfaraBlack } from "utils/colors";
import HorizontalEventAttendees from "components/EventPage/HorizontalEventAttendees";
import { Col, Row } from "react-bootstrap";

const ATTENDEES_LIST = {
  position: "absolute",
  top: "0",
  width: "200px",
  marginLeft: "-210px",
  backgroundColor: "white",
};

const USER_LIST_STYLE = {
  height: "100%",
  width: "100%",
  display: "inline-block",
  verticalAlign: "top",
  marginBottom: 14,
};

const USER_FEED_STYLE = {
  height: "100%",
  width: "100%",
  display: "inline-block",
  marginBottom: 50,
  backgroundColor: "white",
  padding: "0.9em 1.5em",
};

function mapStateToProps(state, props) {
  const event = state.events.get(props.params.id);
  const owner = event && state.users.get(event.userId);
  let leUsers = [];
  let isRSVPD;
  if (event && event.attendees) {
    leUsers = Object.keys(event.attendees).map(item => state.users.get(item));
    isRSVPD = Object.keys(event.attendees).includes(state.authedUser.uid);
  }
  return {
    authedUser: state.authedUser,
    browser: state.browser,
    event,
    owner,
    attendees: leUsers,
    isRSVPD: isRSVPD,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEvent: () => dispatch(getEvent),
  };
}

export class EventPage extends React.Component {

  static defaultProps = {
    isRSVPD: false,
  };

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    uuid: PropTypes.string,
    event: PropTypes.object,
    getEvent: PropTypes.func.isRequired,
    params: PropTypes.object,
    isRSVPD: PropTypes.bool,
    owner: PropTypes.object,
    attendees: PropTypes.array.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  onRSVP() {
    const { authedUser } = this.props;
    const eventId = this.props.params.id;
    if (this.props.isRSVPD) { 
      leaveEvent(eventId, authedUser.uid);
    } else {
      joinEvent(eventId, authedUser.uid);
    }
  }

  componentWillMount() {
    this.props.getEvent(this.props.params.id);
  }

  render() {
    // if (!this.event) { return <div></div> };
    const { event, owner, authedUser, attendees, isRSVPD, browser } = this.props;
    if (!event || !owner) { return null; }
    return <div style={{ width: "100%", position: "relative" }}>
      <EventHero
        authedUser={authedUser}
        event={event}
        owner={owner}
        onRSVPClick={this.onRSVP}
        isRSVPD={isRSVPD}
        isExtraSmall={browser.is.extraSmall}
      />
      <div style={{ width: browser.is.extraSmall ? "95%" : "75%", margin: `${browser.is.extraSmall ? "5px" : "15px"} auto 0px auto` }}>
        <EventDetails style={{ marginBottom: 14 }} event={event} browser={browser}/>
        <Row>
          <Col lg={3} sm={12} style={{ paddingRight: browser.greaterThan.large ? 0 : 15 }}>
            {browser.is.extraSmall ? 
              <HorizontalEventAttendees
                attendees={attendees}
              /> :
              <UserList
                title="going"
                users={attendees}
                isTitlePlural={false}
                className="light-shadow border"
                style={USER_LIST_STYLE}
              />
            }
          </Col>
          <Col lg={6} sm={12}>
            <div className="light-shadow border" style={USER_FEED_STYLE}>
              <span style={{ color: erfaraBlack, fontSize: "1em" }}>Discussion</span>
              <hr style={{ margin: "0.8em 0em" }} />
              <Feed eventId={this.props.params.id}/>
            </div>
          </Col>
        </Row>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
