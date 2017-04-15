import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import MessagesWindow from "components/Messaging/MessagesWindow";
import store from "store/store";
import { addMessage, readMessage } from "utils/Api";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
    // Immutable Map
    conversation: state.conversations.getIn(["map", props.params.id]) || {},
  };
}
export class MobileMessagingPage extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    conversation: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };
  
  constructor(props) {
    super(props);
    autoBind(this);
  }

  sendMessage(text) {
    const { params } = this.props;
    store.dispatch(addMessage(params.id, this.props.authedUser.uid, text, new Date()));
  }

  readMessage(messageId) {
    const { authedUser, params } = this.props;
    readMessage(authedUser.uid, params.id, messageId);
  }

  render() {
    const { conversation } = this.props;
    if (!conversation || !conversation.hasOwnProperty("messages")) { return null; }
    const messages = Object.entries(conversation.messages).map(entry => {
      return {
        id: entry[0],
        ...entry[1],
      };
    });
    return <div style={{ width: "100%", height: "100%", position: "fixed", maxWidth: "1440px", top: "64px", left: "0", display: "flex" }}>
      <MessagesWindow
        messages={messages}
        onSendMessage={this.sendMessage}
        onReadMessage={this.readMessage}
        style={{ width: "100%", height: "100%", display: "inline-block" }}
      />
    </div>;
  }

}

export default connect(mapStateToProps)(MobileMessagingPage);
