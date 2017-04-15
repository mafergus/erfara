import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import MessageListItem from "components/Messaging/MessageListItem";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
  };
}

export class MessageList extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentWillReceiveProps() {
    this.refs.list.scrollTop = this.refs.list.scrollHeight;
  }

  render() {
    const { messages, style, authedUser } = this.props;
    if (!authedUser.hasOwnProperty("uid")) { return null; }
    const STYLE = {
      ...style,
      listStyle: "none",
      paddingLeft: "30px",
      paddingRight: "30px",
      overflow: "auto",
    };
    return <ul style={STYLE} ref="list">
      {messages.map(item => {
        return <MessageListItem key={item.date} message={item} isMine={authedUser.uid === item.from} />;
      })}
    </ul>;
  }
}

export default connect(mapStateToProps)(MessageList);