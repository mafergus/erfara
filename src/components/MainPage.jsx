import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import SplashPage from "components/SplashPage";
import HomePage from "components/HomePage";

function mapStateToProps(state) {
  return {
    isAuthed: state.authedUser.hasOwnProperty("uid"),
  };
}

export function MainPage({ isAuthed }) {
  return isAuthed ? <HomePage /> : <SplashPage />;
}

MainPage.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(MainPage);