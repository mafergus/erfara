import React, { PropTypes } from "react";
import { connect } from "react-redux";
import EventsList from "components/EventList/EventsList";
import firebase from 'firebase';
import RaisedButton from "material-ui/RaisedButton";

function mapStateToProps(state, props) {
  const userEvents = Object.entries(state.events.toJS()).filter(entry => entry[1].userId === props.user.uid);
  const userCategories = Object.entries(state.userCategories.toJS()).filter(entry => entry[1].userId === props.user.uid);
  const categories = userCategories.map(category => state.categories.get(category[1].categoryId));
  const conversations = state.conversations.toJS().map[props.user.uid];

  return {
    categories,
    conversations,
    userEvents,
    userCategories,
  };
}

export class UserDetails extends React.Component {

  static propTypes = {
    categories: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    userCategories: PropTypes.array.isRequired,
    userEvents: PropTypes.array.isRequired,
  };

  deleteUser() {
    const { onClose, userCategories, userEvents, user } = this.props;
    debugger;
    userCategories.forEach(userCategory => {
      debugger;
      console.log("userCategory " + userCategory[0]);
      firebase.database().ref("/user-categories/" + userCategory[0]).remove() 
    });
    userEvents.forEach(eventEntry => {
      const attendeePromises = [];
      Object.keys(eventEntry[1].attendees).forEach(attendee => {
        attendeePromises.push(firebase.database().ref("/users/" + attendee + "/attending/" + eventEntry[0]).remove());
      });
      Promise.all(attendeePromises).then(() => firebase.database().ref("/events/" + eventEntry[0]).remove());
    });
    firebase.database().ref("/users/" + user.uid).remove().then(() => onClose());
  }

  render() {
    const { categories, user, userEvents } = this.props;

    return <div>
      <p>Name: {user && user.name}</p>
      <p>Email: {user && user.email}</p>
      <p>Uid: {user && user.uid}</p>
      <p>Events</p><br />
      <EventsList events={userEvents} /><br />
      <p>Categories</p><br />
      {categories.map(category => <p key={category.id}>{category.name}</p>)}
      <br />
      <RaisedButton
        label="Delete User"
        onClick={() => this.deleteUser()}
        primary
      />
    </div>;
  }
}

export default connect(mapStateToProps)(UserDetails);