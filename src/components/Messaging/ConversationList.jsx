import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import ConversationListItem from "components/Messaging/ConversationListItem";
import { faintBlack } from "material-ui/styles/colors";

export default class ConversationList extends React.Component {

  static propTypes = {
    conversations: PropTypes.array.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
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
    };
    return <ul style={STYLE} className="conversationList">
      {conversations.map(item => {
        return <ConversationListItem 
          key={item.id}
          conversationId={item.id}
          conversation={item}
        />;
      })}
    </ul>;
  }  
}