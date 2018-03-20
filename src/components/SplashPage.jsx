import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import RaisedButton from 'material-ui/RaisedButton';
import { orange50, orange500 } from 'material-ui/styles/colors';
import { darkGray, erfaraBlack } from "utils/colors";
import AuthModal from 'components/auth/AuthModal';
import EventsList from "components/EventList/EventsList";
import { Container, Row, Col } from 'fluid-react';
import HappyEmoji from "material-ui/svg-icons/social/sentiment-very-satisfied";
import ShareIcon from "material-ui/svg-icons/maps/transfer-within-a-station";
import BuildFriendshipIcon from "material-ui/svg-icons/image/brightness-5";
import { orderByDate } from "utils/helpers";

function mapStateToProps(state) {
  return {
    browser: state.browser,
    sortedEvents: orderByDate(Object.entries(state.events.toJS())) || [],
  };
}

export class SplashPage extends React.Component {

  static propTypes = {
    browser: PropTypes.object.isRequired,
    sortedEvents: PropTypes.array.isRequired,
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

  renderInstructionItem(Image, text) {
    const { browser } = this.props;
    const INNER_CONTAINER = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: browser.lessThan.medium ? "25px 5px 10px 5px" : 25,
      flexDirection: "column",
    };
    return <div style={{ width: "33%", display: "inline-block" }}>
      <div style={INNER_CONTAINER}>
        <Image color={erfaraBlack} style={{ height: 30, width: 30, marginBottom: 15 }} />
        <p style={{ textAlign: "center" }}>{text}</p>
      </div>
    </div>;
  }

  renderEvents() {
    const { sortedEvents } = this.props;

    return <Col
      sm={12}
      md={7}
      style={{ height: "100%", overflowX: "hidden" }}
      className="events-panel no-padding"
    >
      <EventsList
        style={{ width: "100%" }}
        events={sortedEvents}
        header={<div style={{ width: "100%", margin: "25px auto 15px auto" }}>
          <h1 style={{ color: orange500, fontSize: "1.6em", fontFamily: "Roboto-Light" }}>Upcoming Events</h1>
          <h3 style={{ color: darkGray, fontSize: "0.8em", marginBottom: 0 }}>Around the San Francisco Bay Area</h3>
        </div>}
      />
    </Col>;
  }

  renderHero() {
    return <Col
      sm={12}
      md={5}
      className="hero no-padding"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div style={{ width: "100%" }} className="hero-image">
        <div>
          <span style={{ fontSize: "2.6em", fontFamily: "Roboto-Light", color: "white" }}>
            Share knowledge,<br />build friendships.
          </span>
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
      <div style={{ backgroundColor: orange50 }}>
        {this.renderInstructionItem(HappyEmoji, "Learn interesting skills from thousands of passionate individuals.")}
        {this.renderInstructionItem(ShareIcon, "Share a unique skill or ability with others.")}
        {this.renderInstructionItem(BuildFriendshipIcon, "Build amazing friendships with people in your community!")}
      </div>
    </Col>;
  }

  render() {
    return <Container style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "100%" }}>
      <AuthModal 
        title="Sign Up"
        isOpen={this.state.isJoinOpen}
        handleClose={() => this.setState({ isJoinOpen: false })} 
      />
      <Row style={{ height: "100%" }}>
        {this.renderHero()}
        {this.renderEvents()}
      </Row>
    </Container>;
  }
}

export default connect(mapStateToProps)(SplashPage);
