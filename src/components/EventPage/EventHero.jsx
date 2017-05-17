import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import DateBox from "components/DateBox";
import RaisedButton from 'material-ui/RaisedButton';
import AuthModal from "components/auth/AuthModal";
import { erfaraBlack, lightTwo } from "utils/colors";
import PhotoPickerModal from "components/Modals/PhotoPickerModal";

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
    host: PropTypes.object.isRequired,
    isExtraSmall: PropTypes.bool.isRequired,
    isRSVPD: PropTypes.bool.isRequired,
    onRSVPClick: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      signUpModalOpen: false,
      showPhotoPicker: false,
    };
  }

  getHeroStyle(event) {
    return { 
      ...HERO_STYLE,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${event.photo}')`,
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
    };
  }

  isHost() {
    const { authedUser, host } = this.props;
    return authedUser.uid === host.uid;
  }

  renderJoinButton() {
    const { authedUser, onRSVPClick, isRSVPD } = this.props;
    const joinLabel = isRSVPD ? "Leave" : "Join";

    return this.isHost() ? <RaisedButton
        label="Change photo"
        onTouchTap={() => this.setState({ showPhotoPicker: true })} 
        primary
      /> :
      <RaisedButton
        label={joinLabel}
        onTouchTap={Object.keys(authedUser).length > 0 ? onRSVPClick : () => this.setState({ signUpModalOpen: true })} 
        primary
      />;
  }

  renderDetails() {
    const { event, host } = this.props;
    const timestamp = new Date(event.date);
    
    return <div style={{ width: "75%", height: "100%", display: "flex", alignItems: "flex-end", margin: "0 auto" }}>
      <DateBox timestamp={timestamp} style={{ height: 70, overflow: "hidden" }} />
      <div style={{ display: "inline-block", height: 70, paddingLeft: 25, overflow: "hidden", flexGrow: "1" }}>
        <div>
          <h2 style={{ fontSize: "1.8em", color: "white", fontWeight: "normal", marginTop: 0, verticalAlign: "middle" }}>{event.title}</h2>
          <img src={host.photo} style={{ height: 30, width: 30, borderRadius: "50%", border: "2px solid white" }} />
          <span style={{ color: lightTwo, marginLeft: 9 }}>hosted by {host.name}</span>
        </div>
      </div>
      <div style={{ height: "100%", display: "flex", alignItems: "flex-end", paddingBottom: 5 }}>
        {this.renderJoinButton()}
      </div>
    </div>;
  }

  renderExtraSmallDetails() {
    const { event } = this.props;
    const timestamp = new Date(event.date);
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
        {this.renderJoinButton()}
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
      <PhotoPickerModal
        eventId={event.id}
        isOpen={this.state.showPhotoPicker}
        onRequestClose={() => this.setState({ showPhotoPicker: false })}
        onPhotoSelected={() => alert("got photo")}
      />
      {this.renderDetails()}
    </div>;
  }
  
  render() {
    const { isExtraSmall } = this.props;
    return isExtraSmall ? this.renderExtraSmallDetails() : this.renderRegular();
  }
}
