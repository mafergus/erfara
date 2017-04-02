import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import ConversationList from "components/Messaging/ConversationList";
import MessagesWindow from "components/Messaging/MessagesWindow";
import store from "store/store";
import { bindActionCreators } from "redux";
import { addMessage, readMessage } from "actions/messageActions";
import Resizable from "react-resizable-box";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
    conversations: state.authedUser.hasOwnProperty("conversations") && state.authedUser.conversations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ readMessage }, dispatch);
}

export class MessagingPage extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    conversations: PropTypes.array.isRequired,
    readMessage: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      conversationId: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    //This is to load the first conversation when this component loads
    if (!this.state.conversationId && 
      nextProps.authedUser.hasOwnProperty("conversations") && 
      Object.keys(nextProps.authedUser["conversations"]).length > 0) {
      const conversationEntry = Object.entries(nextProps.authedUser["conversations"])[0];
      this.setState({ conversationId: conversationEntry[0] });
    }
  }

  sendMessage(text) {
    store.dispatch(addMessage(this.state.conversationId, this.props.authedUser.uid, text, new Date()));
  }

  readMessage(messageId) {
    const { authedUser, readMessage } = this.props;
    readMessage(authedUser.uid, this.state.conversationId, messageId);
  }

  render() {
    if (!this.props.authedUser || !this.props.authedUser.conversations) { return null; }
    return <div style={{ width: "100%", height: "100%", position: "fixed", maxWidth: "1440px", top: "64px", left: "0", display: "flex" }}>
      <Resizable
        customClass="item"
        width="30%"
        minWidth={250}
        maxWidth={600}
        isResizable={{top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}}
        height="100%"
      >
        <ConversationList 
          conversations={this.props.conversations}
          onConversationSelected={conversationId => this.setState({ conversationId })}
          style={{ display: "inline-block", height: "100%", width: "100%", marginTop: "0px" }}
        />
      </Resizable>
      <MessagesWindow 
        conversation={this.props.conversations[this.state.conversationId]}
        onSendMessage={this.sendMessage}
        onReadMessage={this.readMessage}
        style={{ width: "100%", height: "100%", display: "inline-block" }}
      />
    </div>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(MessagingPage);
