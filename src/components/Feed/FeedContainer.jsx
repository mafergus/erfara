import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Feed from "components/Feed/Feed";
import FeedItem from "components/Feed/FeedItem";
import { addFeedMessage, addFeedMessageReply } from "utils/Api";

function mapStateToProps(state, props) {
  const rawFeed = state.feeds.get(props.feedId) || [];
  const feed = [];
  rawFeed.forEach((item, key) => { 
    feed.push({ id: key, ...item.toJS() });
  });
  const users = {};
  feed.forEach(item => { users[item.userId] = state.users.get(item.userId); });
  return {
    authedUser: state.authedUser,
    feed,
    users,
  };
}

export class FeedContainer extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    feedId: PropTypes.string.isRequired,
    feed: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  sendMessage(text) {
    const { authedUser, feedId } = this.props;
    addFeedMessage(feedId, authedUser.uid, text, new Date());
  }

  sendReply(feedItemId, text) {
    const { authedUser, feedId } = this.props;
    addFeedMessageReply(feedId, feedItemId, authedUser.uid, text, new Date());
  }

  render() {
    const { feed, authedUser, users } = this.props;
    return <Feed
      authedUserPhoto={authedUser.photo}
      onSendMessage={this.sendMessage}
      hideMessageBar={!authedUser.hasOwnProperty("uid")}
    >
      {feed.map(item => {
        const user = users[item.userId];
        return <FeedItem
          key={item.id}
          authedUserPhoto={authedUser.photo}
          feedItem={item}
          username={user.name}
          image={user.photo}
          onReply={this.sendReply}
        />;
      })}
    </Feed>;
  }
}

export default connect(mapStateToProps)(FeedContainer);