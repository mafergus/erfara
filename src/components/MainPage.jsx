import React, { PropTypes } from "react";
import { connect } from "react-redux";
import HomePage from "components/HomePage";
import SplashPage from "components/SplashPage";

function mapStateToProps(state) {
  return {
    isAuthed: state.authedUser && Object.keys(state.authedUser).length > 1,
  }
}

export class MainPage extends React.Component {

  static propTypes = {
    isAuthed: PropTypes.bool.isRequired,
  }
  
  render() {
    const { isAuthed } = this.props;
    return isAuthed ? <HomePage /> : <SplashPage />;
  }

}

export default connect(mapStateToProps)(MainPage);