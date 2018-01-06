import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import DateBox from "components/DateBox";
import RaisedButton from 'material-ui/RaisedButton';
import AuthModal from "components/auth/AuthModal";
import { erfaraBlack, lightTwo } from "utils/colors";
import PhotoPickerModal from "components/Modals/PhotoPickerModal";
import Hero from "components/Hero";

const XS_TITLE_STYLE = {
  fontSize: "1.1em",
  alignSelf: "center",
  color: erfaraBlack,
  paddingLeft: 15,
  overflow: "hidden",
  flexGrow: "1"
};

export default class EventHero extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    host: PropTypes.object.isRequired,
    isRSVPD: PropTypes.bool.isRequired,
    onRSVPClick: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      signUpModalOpen: false,
      showPhotoPicker: false,
    };
  }

  isHost() {
    const { authedUser, host } = this.props;
    return authedUser.uid === host.uid;
  }

  renderButtons() {
    const { authedUser, onRSVPClick, isRSVPD } = this.props;
    const joinLabel = isRSVPD ? "Leave" : "Join";
    const BUTTON_CONTAINER_STYLE = {
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      paddingBottom: 5,
      margin: "0px 0px 0px auto",
    };

    return <div style={BUTTON_CONTAINER_STYLE}>
      {
        this.isHost() ? <RaisedButton
          label="Change photo"
          onTouchTap={() => this.setState({ showPhotoPicker: true })} 
          primary
        /> :
        <RaisedButton
          label={joinLabel}
          onTouchTap={Object.keys(authedUser).length > 0 ? onRSVPClick : () => this.setState({ signUpModalOpen: true })} 
          primary
        />
      }
    </div>;
  }

  renderXsTitleContent() {
    const { event } = this.props;
    const timestamp = new Date(event.date);

    return <div style={{ display: "flex", backgroundColor: "white", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
      <DateBox
        timestamp={timestamp}
        style={{ height: 70, overflow: "hidden", border: 0, borderRight: "1px solid rgba(0, 0, 0, 0.08)" }}
      />
      <span style={XS_TITLE_STYLE}>{event.title}</span>
    </div>;
  }
  
  render() {
    const { browser, event, host, width } = this.props;
    const timestamp = new Date(event.date);
    const { signUpModalOpen, showPhotoPicker } = this.state;
    const TITLE_CONTENT = <div style={{ display: "flex", alignItems: "flex-end" }}>
      <DateBox timestamp={timestamp} style={{ height: 70, overflow: "hidden" }} />
      <div style={{ display: "inline-block", paddingLeft: 25, overflow: "hidden", flexGrow: "1" }}>
        <div>
          <h2 style={{ fontSize: "1.8em", color: "white", fontWeight: "normal", marginTop: 0, verticalAlign: "middle" }}>{event.title}</h2>
          <img src={host.photo} style={{ height: 30, width: 30, borderRadius: "50%", border: "2px solid white" }} />
          <span style={{ color: lightTwo, marginLeft: 9 }}>hosted by {host.name}</span>
        </div>
      </div>
    </div>;

    return <div>
      <AuthModal 
        title="Sign Up"
        isOpen={signUpModalOpen}
        handleClose={() => this.setState({ signUpModalOpen: false })} 
      />
      <PhotoPickerModal
        eventId={event.id}
        isOpen={showPhotoPicker}
        onRequestClose={() => this.setState({ showPhotoPicker: false })}
        onPhotoSelected={() => alert("got photo")}
      />
      <Hero
        buttons={this.renderButtons()}
        browser={browser}
        photo={event.photo}
        titleContent={TITLE_CONTENT}
        width={width}
        xsTitleContent={this.renderXsTitleContent()}
      />
    </div>;
  }
}
