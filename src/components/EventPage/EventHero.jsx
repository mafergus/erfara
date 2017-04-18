import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import DateBox from "components/DateBox";
import RaisedButton from 'material-ui/RaisedButton';
import AuthModal from "components/auth/AuthModal";
import { erfaraBlack } from "utils/colors";

const HERO_STYLE = {
  position: "relative",
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "50% 40%",
  objectFit: "cover",
};

export default class EventHero extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    isExtraSmall: PropTypes.bool.isRequired,
    isRSVPD: PropTypes.bool.isRequired,
    onRSVPClick: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      signUpModalOpen: false,
    };
  }

  getHeroStyle(event) {
    return { 
      ...HERO_STYLE,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${event.photo}')`,
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
    };
  }

  renderDetails() {
    const { event, onRSVPClick, authedUser, isRSVPD } = this.props;
    const timestamp = new Date(event.date);
    const joinLabel = isRSVPD ? "Leave" : "Join";

    return <div style={{ width: "75%", height: "100%", display: "flex", alignItems: "flex-end", margin: "0 auto" }}>
      <DateBox timestamp={timestamp} style={{ height: 70, overflow: "hidden" }} />
      <div style={{ display: "inline-block", height: 70, paddingLeft: 35, overflow: "hidden", flexGrow: "1" }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <span style={{ fontSize: "1.7em", verticalAlign: "middle" }}>{event.title}</span>
        </div>
      </div>
      <div style={{ height: "100%", display: "flex", alignItems: "flex-end", paddingBottom: 5 }}>
        <RaisedButton
          label={joinLabel}
          onClick={Object.keys(authedUser).length > 0 ? onRSVPClick : () => this.setState({ signUpModalOpen: true })} 
          primary
        />
      </div>
    </div>;
  }

  renderExtraSmallDetails() {
    const { event, onRSVPClick, isRSVPD, authedUser } = this.props;
    const timestamp = new Date(event.date);
    const joinLabel = isRSVPD ? "Leave" : "Join";
    const SPAN_STYLE = {
      fontSize: "1.1em",
      alignSelf: "center",
      color: erfaraBlack,
      paddingLeft: 15,
      overflow: "hidden",
      flexGrow: "1"
    };

    return <div>
      <div style={this.getHeroStyle(event)} >
        <RaisedButton
          style={{ position: "absolute", bottom: 5, right: 5, width: 50 }}
          label={joinLabel}
          onClick={Object.keys(authedUser).length > 0 ? onRSVPClick : () => this.setState({ signUpModalOpen: true })}
          primary
        />
        <AuthModal 
          title="Sign Up"
          isOpen={this.state.signUpModalOpen}
          handleClose={() => this.setState({ signUpModalOpen: false })} 
        />
      </div>
      <div style={{ display: "flex", backgroundColor: "white", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
        <DateBox
          timestamp={timestamp}
          style={{ height: 70, overflow: "hidden", border: 0, borderRight: "1px solid rgba(0, 0, 0, 0.08)" }}
        />
        <span style={SPAN_STYLE}>{event.title}</span>
      </div>
    </div>;
  }

  renderRegular() {
    const { event } = this.props;
    return <div style={this.getHeroStyle(event)} >
      <AuthModal 
        title="Sign Up"
        isOpen={this.state.signUpModalOpen}
        handleClose={() => this.setState({ signUpModalOpen: false })} 
      />
      {this.renderDetails()}
    </div>;
  }
  
  render() {
    const { isExtraSmall } = this.props;
    return isExtraSmall ? this.renderExtraSmallDetails() : this.renderRegular();
  }
}
