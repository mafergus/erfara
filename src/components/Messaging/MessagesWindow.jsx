import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import MessageList from "components/Messaging/MessageList";
import MessageBar from "components/Messaging/MessageBar";

export default class MessagesWindow extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    messages: PropTypes.array.isRequired,
    onReadMessage: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {},
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentDidMount() {
    const { messages, onReadMessage } = this.props;
    if (messages.length) {
      const lastMessage = messages.slice(-1)[0];
      onReadMessage(lastMessage.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { messages, onReadMessage } = nextProps;
    if (messages.length) {
      const lastMessage = messages.slice(-1)[0];
      onReadMessage(lastMessage.id);
    }
  }

  render() {
    const { style, messages, onSendMessage } = this.props;
    const STYLE = {
      ...style,
      paddingLeft: "80px",
      paddingRight: "80px",
      paddingBottom: "10px",
      position: "relative",
    };
    return <div style={STYLE} className="messaging-pane">
      <img className="background-image" />
      <MessageList messages={messages} style={{ width: "100%", position: "absolute", bottom: "150px", left: "0", top: "0" }} />
      <MessageBar style={{ width: "100%", position: "absolute", bottom: 0, right: 0, left: 0 }} onSend={onSendMessage} />
    </div>;
  }  
}