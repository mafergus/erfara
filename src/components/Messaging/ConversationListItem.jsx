import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { Link } from "react-router";
import { darkBlack, lightBlack, minBlack } from "material-ui/styles/colors";
import Badge from 'material-ui/Badge';
import Moment from "moment";
import { getUnreadMessageCountForConversation } from "utils/helpers";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
    user: state.users.get(props.conversationId),
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
    authedUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    conversation: PropTypes.object.isRequired,
    conversationId: PropTypes.string.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { authedUser, conversation, conversationId, user } = this.props;
    if (!conversation || !user) { return null; }
    const message = Object.entries(conversation.messages).slice(-1)[0][1];
    const photo = user.photo;
    const moment = new Moment(message.date);
    return <Link to={`/messages/${conversationId}`} style={{ textDecoration: "none" }}>
      <li style={{ display: "flex", alignItems: "center", height: 90, position: "relative" }}>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={photo} alt="Sender" style={IMG_STYLE} />
        </div>
        <div style={{ width: "50%", display: "inline-block", flexGrow: "1", paddingRight: 15 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="title ellipsis sm" style={{ color: darkBlack, fontWeight: "500", flexGrow: "1" }}>
              {user.name}
            </span>
            <span style={{ color: minBlack, fontSize: "0.8em" }}>
              {moment.fromNow()}
            </span>
          </div>
          <p className="subtitle ellipsis xs" style={{ color: lightBlack, marginTop: "0.3em" }}>{message.message}</p>
        </div>
        {getUnreadMessageCountForConversation(authedUser, conversation) > 0 && <Badge
          style={{ padding: 0 }}
          badgeContent={getUnreadMessageCountForConversation(authedUser, conversation)}
          badgeStyle={{ top: 2, right: 15 }}
          primary
        />}
      </li>
    </Link>;
  }
}

export default connect(mapStateToProps)(ConversationListItem);