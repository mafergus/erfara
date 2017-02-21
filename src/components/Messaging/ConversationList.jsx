import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import ConversationListItem from "./ConversationListItem";
import { faintBlack } from "material-ui/styles/colors";

export default class ConversationList extends React.Component {

  static propTypes = {
    conversations: PropTypes.object,
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
      {conversations && Object.entries(conversations).map(item => {
        return <ConversationListItem key={item[0]} conversationId={item[0]} conversation={item[1]} onConversationClick={this.props.onConversationSelected} />
      })}
    </ul>;
  }  
}