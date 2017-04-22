import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import ConversationList from "components/Messaging/ConversationList";

function mapStateToProps(state) {
  const conversations = state.conversations.get("map").map((item, key) => { return { id: key, ...item }; });
  return {
    conversations: conversations || [],
  };
}

export class MobileConversationList extends React.Component {

  static propTypes = {
    conversations: PropTypes.array.isRequired,
  };
  
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { conversations } = this.props;
    return <div style={{ width: "100%", height: "100%", position: "fixed", maxWidth: "1440px", top: "64px", left: "0", display: "flex" }}>
      <ConversationList 
        conversations={conversations}
        style={{ display: "inline-block", height: "100%", width: "100%", marginTop: "0px" }}
      />
    </div>;
  }

}

export default connect(mapStateToProps)(MobileConversationList);
