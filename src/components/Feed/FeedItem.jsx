import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { bindActionCreators } from "redux";
import TextField from "material-ui/TextField";
import { erfaraBlack } from "utils/colors";
import { getUser } from "actions/userActions";
import Item from "components/Feed/Item";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
    user: state.users.get(props.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class FeedItem extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object,
    feedItem: PropTypes.object.isRequired,
    feedItemId: PropTypes.string.isRequired,
    getUser: PropTypes.func.isRequired,
    onReply: PropTypes.func.isRequired,
    user: PropTypes.object,
    userId: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isReplyOpen: false,
      reply: "",
    };
  }

  componentWillMount() {
    const { userId, getUser } = this.props;
    if (userId) {
      getUser(userId);
    }
  }

  onKeyPress(event) {
    const { onReply, feedItemId } = this.props;
    if (event.charCode === 13 && this.state.reply.length > 2) { // enter key pressed
      onReply(feedItemId, this.state.reply);
      this.setState({ 
        reply: "",
        isReplyOpen: false,
      });
    } 
  }

  renderReplyBox() {
    const { authedUser } = this.props;
    return <div className="border" style={{ width: "100%", display: "flex", alignItems: "center", height: 60, marginBottom: 15 }}>
      <img alt="You" style={{ height: 30, width: 30, margin: "0px 7px 0px 12px", borderRadius: "50%" }} src={authedUser.photo}/>
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
    const replyItems = Object.entries(replies).map(item => { 
      return <Item
        style={{ padding: "1em 0em" }}
        imageStyle={{ height: 30, width: 30}}
        message={item[1].message}
        timestamp={item[1].timestamp}
        userId={item[1].userId}
      />;
    });
    return <div style={{ padding: "1.4em 0em 1.4em 70px", fontSize: "0.9em" }}>
      {replyItems}
    </div>;
  }

  render() {
    const { feedItem, user } = this.props;
    return <div style={{ padding: "15px 0px 15px 0px", width: "100%" }}>
      <Item message={feedItem.message} timestamp={feedItem.timestamp} user={user}/>
      {feedItem.replies && this.renderReplies(feedItem.replies)}
      <div style={{ padding: "1.4em 0em 1.4em 80px", fontSize: "0.9em" }}><span className="reply-box" onClick={() => this.setState({ isReplyOpen: !this.state.isReplyOpen })}>Reply</span></div>
      {this.state.isReplyOpen && this.renderReplyBox() }
      <hr/>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);