import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import RaisedButton from 'material-ui/RaisedButton';
import AuthModal from "components/auth/AuthModal";

const HERO_STYLE = {
  position: "relative",
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "50% 40%",
  objectFit: "cover",
};

export default class UserHero extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    style: PropTypes.object,
    isFollowing: PropTypes.bool.isRequired,
    onFollowClick: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      showAuthModal: false,
    };
  }
  
  render() {
    const { authedUser, user, isFollowing, onFollowClick, onSendMessage } = this.props;
    const followLabel = isFollowing ? "Unfollow" : "Follow";
    return <div style={{ ...HERO_STYLE, backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${user.coverPhoto}')`, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }} >
      <AuthModal 
        title="Sign Up"
        isOpen={this.state.showAuthModal}
        handleClose={() => this.setState({ showAuthModal: false })} 
      />
      <div style={{ width: "75%", height: "100%", position: "relative", margin: "0 auto" }}>
        <div style={{ height: 80, position: "absolute", bottom: 7, left: 0, right: 0 }}>
          <img alt="User" src={user.photo} style={{ height: 80, width: 80, borderRadius: "50%", verticalAlign: "baseline" }} />
          <div style={{ display: "inline-block", height: 80, paddingLeft: 35, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
              <span style={{ fontSize: "1.7em", verticalAlign: "middle" }}>{user.name}</span>
            </div>
          </div>
          <div style={{ float: "right", height: "100%", display: "flex", alignItems: "flex-end" }}>
            <RaisedButton label="Message" onClick={onSendMessage} style={{ marginRight: "0.7em" }} />
            <RaisedButton label={followLabel} onClick={Object.keys(authedUser).length > 0 ? onFollowClick : () => this.setState({ showAuthModal: true })} primary />
          </div>
        </div>
      </div>
    </div>;
  }
}
