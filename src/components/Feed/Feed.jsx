import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import TextField from "material-ui/TextField";
import { addEventMessage } from "utils/Api";
import store from "store/store";
import FeedItem from "components/Feed/FeedItem";
import { addFeedReply } from "utils/Api";

function mapStateToProps(state, props) {
  return {
    items: props.eventId && state.events.get(props.eventId).feed,
    authedUser: state.authedUser,
  };
}

export class Feed extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.object,
    style: PropTypes.object,
    eventId: PropTypes.string,
    authedUser: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
    this.state = { message: "" };
  }

  onKeyPress(event) {
    if (event.charCode === 13 && this.state.message.length > 2) { // enter key pressed
      store.dispatch(addEventMessage(this.props.eventId, this.props.authedUser.uid, this.state.message, new Date()));
      this.setState({ message: "" });
    } 
  }

  onReplySubmitted(itemId, text) {
    const { eventId, authedUser } = this.props;
    addFeedReply(eventId, authedUser.uid, text, new Date(), itemId);
  }

  renderMessageBar() {
    const STYLE = {
      display: "flex",
      justifyContent: "center",
      margin: "1em 0em",
      ...this.props.style,
    };
    return <div style={STYLE}>
      <img src={this.props.authedUser.photo} alt="You" style={{ height: 50, width: 50, margin: "10px", borderRadius: "50%" }} />
      <div style={{ flexGrow: "1", height: "100%", alignSelf: "center" }}>
        <TextField 
          hintText="Message"
          value={this.state.message}
          style={{ width: "90%", marginLeft: "10px", marginRight: "10px" }}
          onKeyPress={this.onKeyPress}
          onChange={ (event, value) => { this.setState({ message: value }) }}
        />
      </div>
    </div>;
  }

  render() {
    const { style, className, items } = this.props;
    return <div className={className} style={{ ...style, backgroundColor: "white" }}>
      {this.renderMessageBar()}
      <hr style={{ margin: "0.8em 0em" }}/>
      {items && Object.entries(items).map(item => <FeedItem key={item[0]} userId={item[1].userId} feedItem={item[1]} feedItemId={item[0]} onReply={this.onReplySubmitted} />)}
    </div>;
  }
}

export default connect(mapStateToProps)(Feed);