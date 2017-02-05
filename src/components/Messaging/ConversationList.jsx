import React, { PropTypes } from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import ConversationListItem from "./ConversationListItem";
import { faintBlack } from "material-ui/styles/colors";

export default class ConversationList extends React.Component {

  static propTypes = {
    conversations: ImmutablePropTypes.map,
    style: PropTypes.object,
    onConversationSelected: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { conversations, style } = this.props;
    const STYLE = {
      ...style,
      listStyle: "none",
      padding: "0",
      border: `1px solid ${faintBlack}`,
      backgroundColor: "white",
    }
    return <ul style={STYLE} className="conversationList">
      {conversations && conversations.map((item, key) => {
        return <ConversationListItem conversationId={key} conversation={item} onConversationClick={this.props.onConversationSelected} />
      })}
    </ul>;
  }  
}