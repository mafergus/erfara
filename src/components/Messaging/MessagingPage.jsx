import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import Draggable from 'react-draggable';
import ConversationList from "./ConversationList";
import MessagesWindow from "./MessagesWindow";
import store from "../../store/store";
import { addMessage } from "../../actions/messageActions";
import Resizable from "react-resizable-box";
import Title from 'react-title-component';

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
    conversations: state.authedUser.hasOwnProperty("conversations") && state.authedUser.conversations,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export class MessagingPage extends React.Component {
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      conversation: null,
    }
  }

  onConversationSelected(conversationId) {
    this.setState({ conversationId });
  }

  sendMessage(text) {
    store.dispatch(addMessage(this.state.conversationId, this.props.authedUser.uid, text, new Date()));
  }

  render() {
    if (!this.props.authedUser || !this.props.authedUser.conversations) { return null; }
    return <div style={{ width: "100%", height: "100%", position: "fixed", maxWidth: "1440px", top: "64px", left: "0", display: "flex" }}>
      <Resizable
        customClass="item"
        width="20%"
        minWidth={250}
        maxWidth={600}
        isResizable={{top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}}
        height="100%"
      >
        <ConversationList 
          conversations={this.props.conversations}
          onConversationSelected={this.onConversationSelected}
          style={{ display: "inline-block", height: "100%", width: "100%", marginTop: "0px" }}
        />
      </Resizable>
      <MessagesWindow 
        conversation={this.state.conversationId ? this.props.conversations[this.state.conversationId] : Object.values(this.props.conversations)[0]}
        onSendMessage={this.sendMessage}
        style={{ width: "100%", height: "100%", display: "inline-block" }}
      />
    </div>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(MessagingPage);
