import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import FullWidthSection from '../FullWidthSection';
import EventDescription from "./EventDescription";
import EventDetails from "./EventDetails";
import UserList from "../UserList";
import { getEvent, rsvp } from "../../actions/eventActions";
import EventHero from "./EventHero";
import Feed from "../Feed/Feed";
import store from "../../store/store";

const ATTENDEES_LIST = {
  position: "absolute",
  top: "0",
  width: "200px",
  marginLeft: "-210px",
  backgroundColor: "white",
};

function mapStateToProps(state, props) {
  const event = state.events.get(props.params.id);
  const owner = event && state.users.get(event.userId);
  let leUsers = [];
  if (event && event.attendees) {
    event.attendees.forEach(item => { leUsers.push(state.users.get(item)); });
  }
  const isRSVPD = leUsers.some(item => item.uid === state.authedUser.uid);
  return {
    authedUser: state.authedUser,
    event: event,
    owner: owner,
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
    uuid: PropTypes.string,
    event: PropTypes.object,
    getEvent: PropTypes.func.isRequired,
    isRSVPD: PropTypes.bool,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  onRSVP() {
    const { event, authedUser } = this.props;
    const eventId = this.props.params.id;
    store.dispatch(rsvp(event, eventId, authedUser.uid, !this.props.isRSVPD));
  }

  componentWillMount() {
    this.props.getEvent(this.props.params.id);
  }

  componentDidMount() {
    console.log("id: ", this.props.params.id);
  }

  render() {
    // if (!this.event) { return <div></div> };
    const { event, owner, attendees, isRSVPD } = this.props;
    if (!event || !owner) { return <div/>; }
    return <FullWidthSection>
      <div style={{ width: "40%", margin: "0 auto", position: "relative" }}>
        <UserList style={ATTENDEES_LIST} title="Attendees" users={attendees}/>
        <EventHero event={event} owner={owner} onRSVPClick={this.onRSVP} isRSVPD={isRSVPD} />
        <EventDetails event={event}/>
        <EventDescription event={event} />
        <Feed style={{ width: "100%", backgroundColor: "white" }} eventId={this.props.params.id}/>
      </div>
    </FullWidthSection>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
