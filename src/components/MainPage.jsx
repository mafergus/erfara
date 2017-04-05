import React, { PropTypes } from "react";
import { connect } from "react-redux";
import HomePage from "components/HomePage";
import SplashPage from "components/SplashPage";

function mapStateToProps(state) {
  return {
    isAuthed: state.authedUser && Object.keys(state.authedUser).length > 1,
    events: state.events,
    eventEntry: Object.entries(state.events.toJS())
  }
}

export class MainPage extends React.Component {

  static propTypes = {
    isAuthed: PropTypes.bool.isRequired,
    events: PropTypes.object,
    eventEntry:PropTypes.array
  }
  
  render() {
    const { isAuthed, events, eventEntry } = this.props;
    return isAuthed ? <HomePage events={events} eventEntry={eventEntry} /> : <SplashPage />;
  }

}

export default connect(mapStateToProps)(MainPage);