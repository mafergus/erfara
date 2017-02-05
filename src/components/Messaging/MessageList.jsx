import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { faintBlack } from "material-ui/styles/colors";
import MessageListItem from "./MessageListItem";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export class MessageList extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object,
    messages: PropTypes.array,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { messages, style, authedUser } = this.props;
    const STYLE = {
      ...style,
      listStyle: "none",
      paddingLeft: "30px",
      paddingRight: "30px",
      overflow: "auto",
    }
    return <ul style={STYLE}>
      {messages && messages.map((item, key) => {
        return <MessageListItem key={key} message={item} isMine={authedUser.uid == item.from} />;
      })}
    </ul>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);