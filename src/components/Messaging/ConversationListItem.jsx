import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { darkBlack, lightBlack, minBlack } from "material-ui/styles/colors";
import Badge from 'material-ui/Badge';
import { getUser } from "actions/userActions";
import Moment from "moment";
import { getUnreadMessageCountForConversation } from "utils/helpers";

function mapStateToProps(state, props) {
  return {
    user: state.users.get(props.conversationId),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: () => dispatch(getUser),
  };
}

const IMG_STYLE = {
  height: 49,
  width: 49,
  borderRadius: "50%",
  border: `1px solid rgba(0, 0, 0, 0.06)`,
  marginRight: 18,
  marginLeft: 13,
  display: "inline-block",
  flexShrink: "1",
};

export class ConversationListItem extends React.Component {

  static propTypes = {
    getUser: PropTypes.func.isRequired,
    user: PropTypes.object,
    conversation: PropTypes.object.isRequired,
    conversationId: PropTypes.string.isRequired,
    onConversationClick: PropTypes.func.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const messageEntries = this.props.conversation && Object.values(this.props.conversation.messages);
    if (this.props.conversation && messageEntries.length > 0) {
      this.props.getUser(this.props.conversationId);
    }
  }

  getUnreadMessages() {

  }

  render() {
    const { conversation, conversationId, user } = this.props;
    const message = Object.entries(this.props.conversation.messages)[0][1];
    const photo = user && user.photo;
    const moment = new Moment(message.date);
    if (!conversation || !user) { return <div/>; }
    return <li style={{ display: "flex", alignItems: "center", height: 90, position: "relative" }} onClick={ this.props.onConversationClick.bind(null, conversationId) }>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={photo} alt="Sender" style={IMG_STYLE}/>
      </div>
      <div style={{ width: "50%", display: "inline-block", flexGrow: "1", paddingRight: 15 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="title ellipsis" style={{ color: darkBlack, fontSize: "1.2em", fontWeight: "500", flexGrow: "1" }}>{user.name}</span>
          <span style={{ color: minBlack, fontSize: "0.8em" }}>{moment.fromNow()}</span>
        </div>
        <p className="subtitle ellipsis" style={{ color: lightBlack, fontSize: "0.95em", marginTop: "0.3em" }}>{message.message}</p>
      </div>
      {getUnreadMessageCountForConversation(this.props.conversation) > 0 && <Badge
        style={{ padding: 0 }}
        primary={true}
        badgeContent={getUnreadMessageCountForConversation(this.props.conversation)}
        badgeStyle={{ top: 2, right: 10 }}
      />}
    </li>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationListItem);