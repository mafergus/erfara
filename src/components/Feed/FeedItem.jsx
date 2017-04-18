import React, { PropTypes } from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import TextField from "material-ui/TextField";
import { erfaraBlack } from "utils/colors";
import Item from "components/Feed/Item";

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

export class FeedItem extends React.Component {

  static propTypes = {
    authedUserPhoto: PropTypes.string.isRequired,
    feedItem: PropTypes.object.isRequired,
    onReply: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    users: ImmutablePropTypes.map.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isReplyOpen: false,
      reply: "",
    };
  }

  onKeyPress(event) {
    const { onReply, feedItem } = this.props;
    if (event.charCode === 13 && this.state.reply.length > 2) { // enter key pressed
      onReply(feedItem.id, this.state.reply);
      this.setState({ 
        reply: "",
        isReplyOpen: false,
      });
    } 
  }

  renderReplyBox() {
    const { authedUserPhoto } = this.props;
    return <div className="border" style={{ display: "flex", alignItems: "center", height: 50, marginBottom: 15, marginLeft: 70 }}>
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

  renderReplies(replies) {
    const { users } = this.props;
    const replyItems = Object.entries(replies).map(item => { 
      const user = users.get(item[1].userId);
      return <Item
        key={item[0]}
        style={{ padding: "1em 0em" }}
        imageStyle={{ height: 30, width: 30}}
        username={user.name}
        image={user.photo}
        message={item[1].message}
        timestamp={item[1].timestamp}
      />;
    });
    return <div style={{ padding: "0.5em 0em 0.5em 70px", fontSize: "0.9em" }}>
      {replyItems}
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
      {feedItem.replies && this.renderReplies(feedItem.replies)}
      <div style={{ padding: "1em 0em 1em 80px", fontSize: "0.9em" }}>
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

export default connect(mapStateToProps)(FeedItem);
