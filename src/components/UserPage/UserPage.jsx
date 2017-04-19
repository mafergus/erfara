import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import UserDetails from "components/UserPage/UserDetails";
import UserList from "components/UserList";
import UserHero from "components/UserPage/UserHero";
import FeedContainer from "components/Feed/FeedContainer";
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
  let followers = [];
  if (user && user.followers) {
    followers = Object.keys(user.followers).map(userId => state.users.get(userId));
  }
  let eventsAttending = [];
  if (user && user.attending) {
    eventsAttending = Object.entries(user.attending).map(entry => {
      return { id: entry[0], ...state.events.get(entry[0]) };
    });
  }
  let eventsCreated = [];
  if (user && user.events) {
    eventsCreated = Object.entries(user.events).map(entry => {
      return { id: entry[0], ...state.events.get(entry[0]) };
    });
  }
  return {
    eventsAttending,
    eventsCreated,
    authedUser: state.authedUser,
    isFollowing: followers.some(user => user.uid === state.authedUser.uid),
    followers,
    user,
  };
}

export class UserPage extends React.Component {

  static propTypes = {
    eventsAttending: PropTypes.array.isRequired,
    eventsCreated: PropTypes.array.isRequired,
    authedUser: PropTypes.object.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    followers: PropTypes.array.isRequired,
    user: PropTypes.object,
  };

  static defaultProps = {
    eventsAttending: [],
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
    const { authedUser, user, followers, isFollowing, eventsAttending, eventsCreated } = this.props;
    if (!user) { return null; }
    return <div style={{ width: "100%", position: "relative" }}>
      <UserHero
        authedUser={authedUser}
        user={user}
        isFollowing={isFollowing}
        onFollowClick={() => this.onFollowClick()}
        onSendMessage={() => alert("send message")}
      />
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
            <FeedContainer feedId={user.uid} />
          </div>
          <div style={{ width: "24%", marginLeft: "2%", display: "inline-block", height: "500px", verticalAlign: "top", float: "right" }}>
            <EventList title="hosted" events={eventsCreated} />
            <EventList title="attended" events={eventsAttending} style={{ marginTop: "1em" }} />
          </div>
        </div>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps)(UserPage);
