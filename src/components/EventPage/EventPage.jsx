import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import EventDetails from "components/EventPage/EventDetails";
import UserList from "components/UserList";
import { getEvent } from "actions/eventActions";
import { joinEvent, leaveEvent } from "utils/Api";
import EventHero from "components/EventPage/EventHero";
import Feed from "components/Feed/Feed";
import { erfaraBlack } from "utils/colors";

const ATTENDEES_LIST = {
  position: "absolute",
  top: "0",
  width: "200px",
  marginLeft: "-210px",
  backgroundColor: "white",
};

function mapStateToProps(state, props) {
  const event = state.events.get(props.params.id);
  let leUsers = [];
  let isRSVPD = false;
  if (event && event.attendees) {
    leUsers = Object.keys(event.attendees).map(item => state.users.get(item));
    isRSVPD = Object.keys(event.attendees).includes(state.authedUser.uid);
  }
  return {
    authedUser: state.authedUser,
    event,
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
    event: PropTypes.object.isRequired,
    getEvent: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    isRSVPD: PropTypes.bool.isRequired,
    attendees: PropTypes.array.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { getEvent, params } = this.props;
    getEvent(params.id);
  }

  onRSVP() {
    const { authedUser, params, isRSVPD } = this.props;
    const eventId = params.id;
    if (isRSVPD) { 
      leaveEvent(eventId, authedUser.uid);
    } else {
      joinEvent(eventId, authedUser.uid);
    }
  }

  render() {
    // if (!this.event) { return <div></div> };
    const { event, authedUser, attendees, isRSVPD } = this.props;
    if (!event) { return null; }
    return <div style={{ width: "100%", position: "relative" }}>
      <UserList
        style={ATTENDEES_LIST}
        title="Attendees"
        users={attendees}
      />
      <EventHero
        authedUser={authedUser}
        event={event}
        onRSVPClick={this.onRSVP}
        isRSVPD={isRSVPD}
      />
      <div style={{ width: "75%", margin: "35px auto 0px auto" }}>
        <EventDetails
          style={{ marginBottom: 20 }}
          event={event}
        />
        <div>
          <UserList
            title="going"
            users={attendees}
            isTitlePlural={false}
            className="light-shadow border"
            style={{ height: "100%", width: "24%", marginRight: "2%", display: "inline-block", verticalAlign: "top" }}
          /> 
          <div
            className="light-shadow border"
            style={{ height: "100%", width: "50%", display: "inline-block", marginBottom: 50, backgroundColor: "white", padding: "0.9em 1.5em" }}
          >
            <span style={{ color: erfaraBlack, fontSize: "1em" }}>Discussion</span>
            <hr style={{ margin: "0.8em 0em" }} />
            <Feed eventId={this.props.params.id} />
          </div>
        </div>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
