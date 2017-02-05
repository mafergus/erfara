import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { darkBlack, lightBlack, minBlack, faintBlack } from "material-ui/styles/colors";
import { getUser } from "../../actions/userActions";

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
  height: "46px",
  width: "46px",
  minWidth: "50px",
  borderRadius: "50%",
  border: `1px solid rgba(0, 0, 0, 0.06)`,
  marginRight: "20px",
  marginLeft: "12px",
  display: "inline-block",
  flexShrink: "1",
};

export class ConversationListItem extends React.Component {

  static propTypes = {
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
    if (this.props.conversation && this.props.conversation.messages.length > 0) {
      this.props.getUser(this.props.conversation.messages[0].from);
    }
  }

  render() {
    const { conversation, conversationId, user } = this.props;
    const message = Object.entries(this.props.conversation.messages)[0][1];
    const photo = user && user.photo;
    if (!conversation || !user) { return <div></div>; }
    return <li style={{ display: "flex", alignItems: "center", height: "72px", position: "relative" }} onClick={ this.props.onConversationClick.bind(null, conversationId) }>
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={photo} style={IMG_STYLE}/>
      </div>
      <div style={{ width: "50%", display: "inline-block", flexGrow: "1", paddingRight: "20px" }}>
        <div style={{ display: "flex" }}>
          <span className="title ellipsis" style={{ color: darkBlack, fontWeight: "500", flexGrow: "1" }}>{user.name}</span>
          <span style={{ color: minBlack, fontSize: "0.8em" }}>9:47</span>
        </div>
        <p className="subtitle ellipsis" style={{ color: lightBlack, fontSize: "0.9em", marginTop: "0.3em" }}>{message.message}</p>
      </div>
    </li>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationListItem);