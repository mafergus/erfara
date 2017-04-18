import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import MessageListItem from "components/Messaging/MessageListItem";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
    isMobile: state.browser.is.extraSmall,
  };
}

export class MessageList extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object,
    isMobile: PropTypes.bool.isRequired,
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

  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    node.scrollIntoView({behavior: "smooth"});
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { messages, style, authedUser, isMobile } = this.props;
    const STYLE = {
      ...style,
      listStyle: "none",
      paddingLeft: "30px",
      paddingRight: "30px",
      overflow: "auto",
    };
    return <ul style={STYLE} ref="list">
      {messages.map((item, index) => {
        return <MessageListItem
          key={item.date}
          message={item}
          isMine={authedUser.uid === item.from}
          isMobile={isMobile}
        />;
      })}
      <div ref={el => { this.messagesEnd = el; }} />
    </ul>;
  }
}

export default connect(mapStateToProps)(MessageList);