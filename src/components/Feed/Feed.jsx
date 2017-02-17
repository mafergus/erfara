import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import firebase from "../../actions/database";
import { darkBlack, lightBlack, minBlack, faintBlack, orange200, orange500, orange50 } from "material-ui/styles/colors";
import TextField from "material-ui/TextField";
import SendIcon from 'material-ui/svg-icons/content/send';
import IconButton from 'material-ui/IconButton';
import { addEventMessage } from "../../actions/eventActions";
import store from "../../store/store";
import FeedItem from "./FeedItem";

function mapStateToProps(state, props) {
  return {
    items: props.eventId && state.events.get(props.eventId).feed,
    authedUser: state.authedUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export class Feed extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    eventId: PropTypes.string,
    authedUser: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
    this.state = { message: "" };
  }

  componentWillMount() {
    // const { eventId } = this.props;
    // firebase.database().ref(`/events/${eventId}/feed/`).on('value', function(snapshot) {
    //   debugger;
    //   const feed = snapshot.val();
    //   console.log("Got event feed feed: ", feed);
    //   if (feed) {
    //     store.dispatch({ type: "GET_EVENT_FEED_SUCCESS", eventId, feed });
    //   }
    // });
  }

  onSendClicked() {
    // this.props.onSend(this.state.message);
    store.dispatch(addEventMessage(this.props.eventId, this.props.authedUser.uid, this.state.message, new Date()));
    this.setState({ message: "" });
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
    const { message, userId } = item;
    return <FeedItem key={key} userId={userId} feedItem={item} />;
  }

  renderMessageBar() {
    const STYLE = {
      display: "flex",
      justifyContent: "center",
      borderTop: `1px solid ${faintBlack}`,
      borderBottom: `1px solid ${faintBlack}`,
      backgroundColor: orange50,
      zIndex: "30",
    };
    return <div style={STYLE}>
      <div style={{ flexGrow: "1", height: "100%", width: "100%", backgroundColor: {orange500} }}>
        <div style={{ height: "90px", borderTop: `1px solid" ${faintBlack}`, backgroundColor: "white", borderRadius: "3%" }}>
          <TextField 
            hintText="Message"
            value={this.state.message}
            onKeyPress={this.onKeyPress}
            style={{ width: "100%" }}
            onKeyPress={this.onKeyPress}
            onChange={ (event, value) => { this.setState({ message: value }) }} />
        </div>
      </div>
      <div style={{ padding: "21px" }}>
        <IconButton
          style={{ height: "50px", width: "50px", padding: "10px", paddingLeft: "15px" }}
          iconStyle={{ height: "30px", width: "30px", margin: "auto", color: lightBlack }}
          onClick={this.onSendClicked}
        >
          <SendIcon hoverColor={orange200} />
        </IconButton>
      </div>
    </div>;
  }

  render() {
    const { style, items } = this.props;
    return <div style={{ ...style, paddingLeft: "10px", paddingTop: "30px", borderTop: `1px solid ${faintBlack}` }}>
      {items && Object.entries(items).map(item => this.renderFeedItem(item[0], item[1]))}
      {this.renderMessageBar()}
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);