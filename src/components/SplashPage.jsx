import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import RaisedButton from 'material-ui/RaisedButton';
// import Share from 'material-ui/svg-icons/notification/wc';
// import Learn from 'material-ui/svg-icons/social/sentiment-very-satisfied';
// import Experience from 'material-ui/svg-icons/image/brightness-7';
import withWidth from 'material-ui/utils/withWidth';
import { orange500, } from 'material-ui/styles/colors';
import { darkGray } from "utils/colors";
import AuthModal from 'components/auth/AuthModal';
import OnboardingModal from 'components/Onboarding/OnboardingModal';
import EventsList from "components/EventList/EventList";
import { Grid, Col } from "react-bootstrap";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
  };
}

export class SplashPage extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      showEvents: true,
      isJoinOpen: false,
    };
  }

  // renderDescriptionItem(image, text) {
  //   return <div style={{ display: "inline-block", margin: "0px 20px", verticalAlign: "text-top" }}>
  //     <div style={{ textAlign: "center" }}>{image}</div>
  //     <h4 style={{ width: "200px", textAlign: "center", fontWeight: "200", fontSize: "0.8em", color: darkBlack }}>{text}</h4>
  //   </div>;
  // }

  // renderDescription() {
  //   const style = {
  //     color: lightBlack,
  //     height: "36px",
  //     width: "36px",
  //   }
  //   return <div style={{ width: "100%", backgroundColor: orange50, display: "flex", alignItems: "center", justifyContent: "center" }}>
  //     {this.renderDescriptionItem(<Learn style={style} />, "Learn interesting skills from thousands of passionate individuals")}
  //     {this.renderDescriptionItem(<Share style={style} />, "Share a unique skill or ability with others")}
  //     {this.renderDescriptionItem(<Experience style={style} />, "Build amazing friendships with people in your community")}
  //   </div>
  // }

  renderHero() {
    return <Col sm={12} md={5} className="hero no-padding">
      <div style={{ width: "100%" }} className="hero-image">
        <div>
          <span style={{ fontSize: "2.6em", fontFamily: "Roboto-Light", color: "white" }}>Share knowledge,<br/>build friendships.</span>
        </div>
        <RaisedButton 
          style={{ marginTop: 50 }}
          label="JOIN THE COMMUNITY"
          labelColor="#FFFFFF"
          onTouchTap={() => this.setState({ isJoinOpen: true })}
          backgroundColor="#07ADB0"
        />
        <div style={{ marginTop: 40, fontSize: "0.9em", fontColor: "white", textDecoration: "underline" }}>Learn how it works</div>
      </div>
    </Col>;
  }

  static renderEvents() {
    return <Col sm={12} md={7} className="events-panel no-padding">
      <div style={{ height: "100%", overflowX: "hidden" }}>
        <EventsList
          style={{ width: "100%" }}
          header={<div style={{ width: "100%", margin: "25px auto 15px auto" }}>
            <h1 style={{ color: orange500, fontSize: "1.6em", fontFamily: "Roboto-Light" }}>Upcoming Events</h1>
            <h3 style={{ color: darkGray, fontSize: "0.8em", marginBottom: 0 }}>Around the San Francisco Bay Area</h3>
          </div>}
        />
      </div>
    </Col>;
  }

  render() {
    return <Grid>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "100%" }}>
        <OnboardingModal
          isOpen={false}
          handleClose={() => null}
        />
        <AuthModal 
          title="Sign Up"
          isOpen={this.state.isJoinOpen}
          handleClose={() => this.setState({ isJoinOpen: false })} 
        />
        {this.renderHero()}
        {SplashPage.renderEvents()}
      </div>
    </Grid>;
  }
}

export default connect(mapStateToProps)(withWidth()(SplashPage));
