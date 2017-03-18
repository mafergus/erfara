import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import UserDetails from "components/UserPage/UserDetails";
import UserList from "components/UserList";
import UserHero from "components/UserPage/UserHero";
import UserFeed from "components/UserFeed/UserFeed";
import { erfaraBlack } from "utils/colors";

const ATTENDEES_LIST = {
  position: "absolute",
  top: "0",
  width: "200px",
  marginLeft: "-210px",
  backgroundColor: "white",
};

function mapStateToProps(state, props) {
  const user = state.users.get(props.params.id);
  const attending = state.events.map((item, key) => {
    const attendees = Object.keys(item.attendees);
    if (attendees.includes(state.authedUser.uid)) { 
      return key;
    }
  });
  return {
    attending,
    authedUser: state.authedUser,
    user,
  };
}

export class UserPage extends React.Component {

  static propTypes = {
    attending: PropTypes.any,
    authedUser: PropTypes.object.isRequired,
    params: PropTypes.object,
    user: PropTypes.object,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  // onRSVP() {
    // const { event, authedUser } = this.props;
    // const eventId = this.props.params.id;
    // rsvp(event, eventId, authedUser.uid, !this.props.isRSVPD);
  // }

  render() {
    const { user } = this.props;
    const followers = user && user.followers;
    if (!user) { return null; }
    return <div style={{ width: "100%", position: "relative" }}>
      <UserList style={ATTENDEES_LIST} title="Attendees" users={followers}/>
      <UserHero user={user} isFollowing={false} onFollowClick={() => alert("follow clicked")} onSendMessage={() => alert("send message")} />
      <div style={{ width: "75%", margin: "35px auto 0px auto" }}>
        <UserDetails style={{ marginBottom: 20 }} user={user}/>
        <div>
          <UserList title="going" users={followers} className="light-shadow border" style={{ height: "100%", width: "24%", marginRight: "2%", display: "inline-block", verticalAlign: "top" }}/> 
          <div className="light-shadow border" style={{ height: "100%", width: "50%", display: "inline-block", marginBottom: 50, backgroundColor: "white", padding: "0.9em 1.5em" }}>
            <span style={{ color: erfaraBlack, fontSize: "1em" }}>Discussion</span>
            <hr style={{ margin: "0.8em 0em" }} />
            <UserFeed userId={user.uid} />
          </div>
          <div style={{ backgroundColor: "blue", width: "24%", display: "inline-block", height: "500px", verticalAlign: "top" }}>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps)(UserPage);
