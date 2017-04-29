import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import ConversationList from "components/Messaging/ConversationList";
import MessagesWindow from "components/Messaging/MessagesWindow";
import { addMessage, readMessage } from "utils/Api";

function mapStateToProps(state, props) {
  const conversations = [];
  state.conversations.get("map").forEach((item, key) => {
    conversations.push({ id: key, ...item });
  });
  return {
    authedUser: state.authedUser,
    conversation: state.conversations.getIn(["map", props.params.id]) || {},
    // Immutable Map
    conversations: conversations || [],
  };
}

export class MessagingPage extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    conversation: PropTypes.object.isRequired,
    conversations: PropTypes.array.isRequired,
    params: PropTypes.object,
  };

  static defaultProps = {
    params: {},
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.setDefaultConversation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setDefaultConversation(nextProps);
  }

  setDefaultConversation(props) {
    const { conversations, params } = props;
    if (!params.hasOwnProperty("id") && conversations.size > 0) {
      const convoId = conversations.keySeq().first();
      this.context.router.push("/messages/" + convoId);
    }
  }

  sendMessage(text) {
    const { params, authedUser } = this.props;
    addMessage(params.id, authedUser.uid, text, new Date());
  }

  readMessage(messageId) {
    const { authedUser, params } = this.props;
    readMessage(authedUser.uid, params.id, messageId);
  }

  render() {
    const { conversation, conversations } = this.props;
    const messages = conversation.hasOwnProperty("messages") ? 
      Object.entries(conversation.messages).map(entry => { return { id: entry[0], ...entry[1] }; }) : [];
    return <div style={{ width: "100%", height: "100%", position: "fixed", maxWidth: 1440, top: 64, left: 0, display: "flex" }}>
      <ConversationList 
        conversations={conversations}
        style={{ display: "inline-block", height: "100%", width: "30%", marginTop: "0px" }}
      />
      <MessagesWindow
        conversation={conversation}
        messages={messages}
        onSendMessage={this.sendMessage}
        onReadMessage={this.readMessage}
        style={{ width: "100%", height: "100%", display: "inline-block" }}
      />
    </div>;
  }

}

export default connect(mapStateToProps)(MessagingPage);
