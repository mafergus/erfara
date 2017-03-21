import React, { PropTypes } from "react";
import { connect } from "react-redux";
import HomePage from "components/HomePage";
import SplashPage from "components/SplashPage";

function mapStateToProps(state) {
  return {
    isAuthed: state.authedUser && Object.keys(state.authedUser).length > 1,
    events: state.events
  }
}

export class MainPage extends React.Component {

  static propTypes = {
    isAuthed: PropTypes.bool.isRequired,
    events: PropTypes.object
  }
  
  render() {
    const { isAuthed, events } = this.props;
    return isAuthed ? <HomePage events={events} /> : <SplashPage />;
  }

}

export default connect(mapStateToProps)(MainPage);