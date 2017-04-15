import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import UserDetails from "components/UserPage/UserDetails";
import UserList from "components/UserList";
import UserHero from "components/UserPage/UserHero";
import Feed from "components/Feed/Feed";
import EventList from "components/UserPage/EventList";
import { erfaraBlack } from "utils/colors";
import { followUser, unfollowUser } from "utils/Api";

const USER_LIST_STYLE = {
  height: "100%",
  width: "24%",
  marginRight: "2%",
  display: "inline-block",
  verticalAlign: "top",
};

const FEED_CONTAINER_STYLE = { 
  height: "100%",
  width: "48%",
  display: "inline-block",
  marginBottom: 50,
  backgroundColor: "white",
  padding: "0.9em 1.5em"
};

function mapStateToProps(state, props) {
  const user = state.users.get(props.params.id);
  const followers = user && user.followers && Object.keys(user.followers).map(userId => state.users.get(userId));
  const attending = {};
  if (user && user.attending) {
    Object.entries(user.attending).forEach(item => attending[item[0]] = state.events.get(item[0]));
  }
  return {
    attending,
    authedUser: state.authedUser,
    isFollowing: followers && Object.keys(user.followers).includes(state.authedUser.uid),
    followers,
    user,
  };
}

export class UserPage extends React.Component {

  static propTypes = {
    attending: PropTypes.array,
    authedUser: PropTypes.object.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    followers: PropTypes.array.isRequired,
    user: PropTypes.object,
  };

  static defaultProps = {
    attending: [],
    user: null,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  onFollowClick() {
    const { authedUser, user, isFollowing } = this.props;
    if (isFollowing) {
      unfollowUser(authedUser.uid, user.uid);
    } else {
      followUser(authedUser.uid, user.uid);
    }
  }

  render() {
    const { authedUser, user, followers, isFollowing, attending } = this.props;
    if (!user) { return null; }
    return <div style={{ width: "100%", position: "relative" }}>
      <UserHero authedUser={authedUser} user={user} isFollowing={isFollowing} onFollowClick={() => this.onFollowClick()} onSendMessage={() => alert("send message")} />
      <div style={{ width: "75%", margin: "35px auto 0px auto" }}>
        <UserDetails style={{ marginBottom: 20 }} user={user} />
        <div>
          <UserList
            title="followers"
            users={followers}
            className="light-shadow border"
            style={USER_LIST_STYLE}
          /> 
          <div className="light-shadow border" style={FEED_CONTAINER_STYLE}>
            <span style={{ color: erfaraBlack, fontSize: "1em" }}>Discussion</span>
            <hr style={{ margin: "0.8em 0em" }} />
            <Feed user={user} />
          </div>
          <div style={{ width: "24%", marginLeft: "2%", display: "inline-block", height: "500px", verticalAlign: "top", float: "right" }}>
            <EventList title="hosted" events={user.events} />
            <EventList title="attended" events={attending} style={{ marginTop: "1em" }} />
          </div>
        </div>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps)(UserPage);
