import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import FullWidthSection from 'components/FullWidthSection';
import EventDescription from "components/EventPage/EventDescription";
import EventDetails from "components/EventPage/EventDetails";
import UserList from "components/UserList";
import { getEvent, rsvp } from "actions/eventActions";
import EventHero from "components/EventPage/EventHero";
import Feed from "components/Feed/Feed";
import store from "store/store";

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
  let isRSVPD;
  if (event && event.attendees) {
    leUsers = Object.keys(event.attendees).map(item => state.users.get(item));
    isRSVPD = Object.keys(event.attendees).includes(state.authedUser.uid);
  }
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
