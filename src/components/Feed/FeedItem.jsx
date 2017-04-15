import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import TextField from "material-ui/TextField";
import { erfaraBlack } from "utils/colors";
import Item from "components/Feed/Item";

export default class FeedItem extends React.Component {

  static propTypes = {
    authedUserPhoto: PropTypes.string.isRequired,
    feedItem: PropTypes.object.isRequired,
    onReply: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  };

  static renderReplies(replies) {
    const replyItems = Object.entries(replies).map(item => { 
      return <Item
        key={item[0]}
        style={{ padding: "1em 0em" }}
        imageStyle={{ height: 30, width: 30}}
        message={item[1].message}
        timestamp={item[1].timestamp}
      />;
    });
    return <div style={{ padding: "1.4em 0em 1.4em 70px", fontSize: "0.9em" }}>
      {replyItems}
    </div>;
  }

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isReplyOpen: false,
      reply: "",
    };
  }

  onKeyPress(event) {
    const { onReply } = this.props;
    if (event.charCode === 13 && this.state.reply.length > 2) { // enter key pressed
      onReply(this.state.reply);
      this.setState({ 
        reply: "",
        isReplyOpen: false,
      });
    } 
  }

  renderReplyBox() {
    const { authedUserPhoto } = this.props;
    return <div className="border" style={{ width: "100%", display: "flex", alignItems: "center", height: 60, marginBottom: 15 }}>
      <img alt="You" style={{ height: 30, width: 30, margin: "0px 7px 0px 12px", borderRadius: "50%" }} src={authedUserPhoto} />
      <TextField 
        hintText="Reply"
        hintStyle={{ fontSize: "0.9em" }}
        inputStyle={{ color: erfaraBlack }}
        underlineShow={false}
        value={this.state.reply}
        style={{ flexGrow: "1", margin: "0px 15px" }}
        onKeyPress={this.onKeyPress}
        onChange={(event, value) => { this.setState({ reply: value }); }}
        autoFocus
      />
    </div>;
  }

  render() {
    const { feedItem, username, image } = this.props;
    return <div style={{ padding: "15px 0px 15px 0px", width: "100%" }}>
      <Item
        message={feedItem.message}
        username={username}
        image={image}
        timestamp={feedItem.timestamp}
      />
      {feedItem.replies && FeedItem.renderReplies(feedItem.replies)}
      <div style={{ padding: "1.4em 0em 1.4em 80px", fontSize: "0.9em" }}>
        <span
          className="reply-box"
          onClick={() => this.setState({ isReplyOpen: !this.state.isReplyOpen })}
        >
          Reply
        </span>
      </div>
      {this.state.isReplyOpen && this.renderReplyBox()}
      <hr />
    </div>;
  }
}
