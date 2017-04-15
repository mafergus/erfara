import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Feed from "components/Feed/Feed";
import FeedItem from "components/Feed/FeedItem";

function mapStateToProps(state, props) {
  const feed = state.feed.get(props.feedId) || {};
  const users = {};
  feed.forEach((item, key) => {
    user[key] = state.users.get(item.userId);
  });
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
    const { feedId } = this.props;
    store.dispatch(addEventMessage(feedId, authedUser.uid, text, new Date()));
  }

  sendReply(text) {
    const { authedUser, feedId } = this.props;
    addFeedReply(feedId, authedUser.uid, text, new Date(), itemId);
  }

  render() {
    const { feed, authedUser, users } = this.props;
    const items = Object.entries(feed).map(entry => { return { id: entry[0], ...entry[1] }; });
    return <Feed
      authedUserPhoto={authedUser.photo}
      onSendMessage={this.sendMessage}
      hideMessageBar={!authedUser.hasOwnProperty("uid")}
    >
      {items.map(item => {
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