import React, { PropTypes } from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import ConversationList from "components/Messaging/ConversationList";

function mapStateToProps(state) {
  return {
    // Immutable Map
    conversations: state.conversations.get("map") || {},
  };
}

export class MobileConversationList extends React.Component {

  static propTypes = {
    conversations: ImmutablePropTypes.map.isRequired,
    params: PropTypes.object,
  };

  static defaultProps = {
    params: {id: ""},
  };
  
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { conversations, params } = this.props;
    const conversation = conversations.get(params.id) || conversations.valueSeq().first();
    if (!conversation) { return null; }
    return <div style={{ width: "100%", height: "100%", position: "fixed", maxWidth: "1440px", top: "64px", left: "0", display: "flex" }}>
      <ConversationList 
        conversations={conversations}
        style={{ display: "inline-block", height: "100%", width: "100%", marginTop: "0px" }}
      />
    </div>;
  }

}

export default connect(mapStateToProps)(MobileConversationList);
