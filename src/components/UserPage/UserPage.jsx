import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import RaisedButton from 'material-ui/RaisedButton';
import { getUser } from "../../actions/userActions";
import FullWidthSection from '../FullWidthSection';
import EventDescription from "../EventPage/EventDescription";
import UserList from "../UserList";
import Hero from "../Hero";
import UserDetails from "./UserDetails";

const H3STYLE = {
  display: "inline-block",
  fontSize: "1.8em",
  fontWeight: "normal",
  margin: "0 auto",
};

const IMG_STYLE = {
  borderRadius: "50%",
  height: "80px",
  width: "80px",
  margin: "0 auto",
  objectFit: "cover",
  verticalAlign: "middle",
  marginRight: "1.5em",
};

function mapStateToProps(state, props) {
  const user = state.users.get(props.params.id);
  let buddies = [];
  const leBuddies = user && user.buddies && state.users.filter(aUser => user.buddies.hasOwnProperty(aUser.uid));
  leBuddies && leBuddies.forEach((item, key) => {
    buddies.push(item);
  });
  return {
    authedUser: state.authedUser,
    user,
    users: state.users,
    buddies,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: () => dispatch(getUser),
  };
}

export class UserPage extends React.Component {

  static propTypes = {
    getUser: PropTypes.func.isRequired,
    isFriend: PropTypes.bool.isRequired,
    user: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this); 
  }

  getFollowers() {
    const { user, users } = this.props;
    const followers = [];
    Object.entries(user.followers).map(item => {
      const user = users.get(item[1]);
      if (user) { followers.push(); }
    });
    return followers;
  }

  render() {
    const { user, buddies } = this.props;
    if (!user) { return <div/>; }
    return <FullWidthSection>
      <div style={{ width: "40%", margin: "0 auto", position: "relative" }}>
        <UserList users={buddies} title="Buddies" style={{ position: "absolute", top: "0", width: "200px", marginLeft: "-210px", backgroundColor: "white" }}/>
        <Hero image={user.coverPhoto}>
          <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
            <img style={IMG_STYLE} src={user.photo}/>
            <h3 style={ H3STYLE }>{user.name}</h3>
          </div>
          <RaisedButton label="Add Friend" style={{ position: "absolute", right: "15px", bottom: "15px" }}/>
        </Hero>
        <UserDetails />
      </div>
    </FullWidthSection>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);