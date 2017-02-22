import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { faintBlack } from "material-ui/styles/colors";
import TextField from "material-ui/TextField";
import { addUserFeed } from "actions/userActions";
import store from "store/store";
import UserFeedItem from "components/UserFeed/UserFeedItem";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
  };
}

export class UserFeed extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    authedUser: PropTypes.object,
    user: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
    this.state = { feedback: "" };
  }

  componentWillMount() {
    // const { eventId } = this.props;
    // firebase.database().ref(`/events/${eventId}/feed/`).on('value', function(snapshot) {
    //   const feed = snapshot.val();
    //   console.log("Got event feed feed: ", feed);
    //   if (feed) {
    //     store.dispatch({ type: "GET_EVENT_FEED_SUCCESS", eventId, feed });
    //   }
    // });
  }

  onSendClicked() {
    // this.props.onSend(this.state.feedback);
    store.dispatch(addUserFeed(this.props.authedUser.uid, this.state.feedback, new Date()));
    this.setState({ feedback: "" });
  }

  onKeyPress(event) {
    if (event.charCode === 13) { // enter key pressed
      this.onSendClicked();  
    } 
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  renderFeedItem(key, item) {
    const { userId } = item;
    return <UserFeedItem key={key} userId={userId} feedItem={item} />;
  }

  renderMessageBar() {
    const STYLE = {
      display: "flex",
      justifyContent: "center",
      borderTop: `1px solid ${faintBlack}`,
      borderBottom: `1px solid ${faintBlack}`,
    };
    return <div style={STYLE}>
      <img src={this.props.authedUser.photo} alt="You" style={{ height: "40px", width: "40px", margin: "10px", borderRadius: "50%" }} />
      <div style={{ flexGrow: "1", height: "100%", alignSelf: "center" }}>
        <TextField 
          hintText="Message"
          value={this.state.feedback}
          style={{ width: "90%", marginLeft: "10px", marginRight: "10px" }}
          onKeyPress={this.onKeyPress}
          onChange={ (event, value) => { this.setState({ feedback: value }) }} />
      </div>
    </div>;
  }

  render() {
    const { style } = this.props;
    const feed = this.props.user.feed;
    console.log(this.props);
    return <div style={{ ...style, borderTop: `1px solid ${faintBlack}` }}>
      {feed && Object.entries(feed).map(item => this.renderFeedItem(item[0], item[1]))}
      {this.renderMessageBar()}
    </div>;
  }
}

export default connect(mapStateToProps)(UserFeed);