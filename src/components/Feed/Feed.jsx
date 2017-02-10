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
    store.dispatch(addEventMessage(this.props.eventId, this.props.authedUser.uid, this.state.message));
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
    return <div key={key} style={{ display: "flex", padding: "0px 20px 60px 20px", width: "100%" }}>
      <div style={{ width: "80px" }}>
        <img style={{ height: "40px", width: "40px", borderRadius: "50%", verticalAlign: "top" }} src="https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/11009152_10105063465546270_5215382255678934863_n.jpg?oh=185a667a757d3d5f38824901c1c1d3ab&oe=5923891C"/>
      </div>
      <div style={{ height: "100%", flexGrow: "1" }}>
        <div style={{ marginBottom: "1em" }}>
          <span style={{ color: darkBlack, fontSize: "0.9em", fontWeight: "500" }}>{userId}</span>
          <span style={{ float: "right", color: minBlack, fontWeight: "500", fontSize: "0.75em" }}>9:45pm</span>
        </div>
        <span style={{ color: lightBlack }}>{message}</span>
      </div>
      <hr/>
    </div>;
  }

  renderMessageBar() {
    const STYLE = {
      display: "flex",
      justifyContent: "center",
      borderTop: `1px solid ${faintBlack}`,
      backgroundColor: orange50,
      zIndex: "30",
    };
    return <div style={STYLE}>
      <div style={{ flexGrow: "1", height: "100%", width: "100%", backgroundColor: {orange500} }}>
        <div style={{ height: "90px", border: `1px solid" ${faintBlack}`, backgroundColor: "white", borderRadius: "3%" }}>
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
    return <div style={{ ...style, paddingLeft: "10px" }} className="border">
      <hr style={{ paddingTop: "8px" }}/>
      {items && Object.entries(items).map(item => this.renderFeedItem(item[0], item[1]))}
      <hr/>
      {this.renderMessageBar()}
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);