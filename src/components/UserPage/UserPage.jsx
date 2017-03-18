import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import UserDetails from "components/UserPage/UserDetails";
import UserList from "components/UserList";
import UserHero from "components/UserPage/UserHero";
import UserFeed from "components/UserFeed/UserFeed";
import EventList from "components/UserPage/EventList";
import { erfaraBlack } from "utils/colors";
import { followUser, unfollowUser } from "utils/Api";

function mapStateToProps(state, props) {
  const user = state.users.get(props.params.id);
  const followers = user && user.followers && Object.keys(user.followers).map(userId => state.users.get(userId));
  return {
    authedUser: state.authedUser,
    isFollowing: followers && Object.keys(user.followers).includes(state.authedUser.uid),
    followers,
    user,
  };
}

export class UserPage extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    isFollowing: PropTypes.bool,
    followers: PropTypes.array,
    params: PropTypes.object,
    user: PropTypes.object,
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
    const { user, followers, isFollowing } = this.props;
    if (!user) { return null; }
    return <div style={{ width: "100%", position: "relative" }}>
      <UserHero user={user} isFollowing={isFollowing} onFollowClick={() => this.onFollowClick()} onSendMessage={() => alert("send message")} />
      <div style={{ width: "75%", margin: "35px auto 0px auto" }}>
        <UserDetails style={{ marginBottom: 20 }} user={user}/>
        <div>
          <UserList title="followers" users={followers} className="light-shadow border" style={{ height: "100%", width: "24%", marginRight: "2%", display: "inline-block", verticalAlign: "top" }}/> 
          <div className="light-shadow border" style={{ height: "100%", width: "45%", display: "inline-block", marginBottom: 50, backgroundColor: "white", padding: "0.9em 1.5em" }}>
            <span style={{ color: erfaraBlack, fontSize: "1em" }}>Discussion</span>
            <hr style={{ margin: "0.8em 0em" }} />
            <UserFeed userId={user.uid} />
          </div>
          <div style={{ width: "24%", display: "inline-block", height: "500px", verticalAlign: "top", float: "right" }}>
            <EventList title="events hosted" events={user.events}/>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps)(UserPage);
