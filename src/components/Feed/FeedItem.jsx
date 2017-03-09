import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { bindActionCreators } from "redux";
import { darkBlack, lightBlack, minBlack } from "material-ui/styles/colors";
import { erfaraBlack } from "utils/colors";
import { getUser } from "actions/userActions";
import TextField from "material-ui/TextField";
import Moment from "moment";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
    user: state.users.get(props.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class FeedItem extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object,
    feedItem: PropTypes.object,
    getUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    userId: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isReplyOpen: false,
      reply: "",
    };
  }

  componentWillMount() {
    const { userId, getUser } = this.props;
    if (userId) {
      getUser(userId);
    }
  }

  onKeyPress(event) {
    if (event.charCode === 13) { // enter key pressed
      alert(this.state.reply);
    } 
  }

  renderReplyBox() {
    const { authedUser } = this.props;
    return <div className="border" style={{ width: "100%", display: "flex", alignItems: "center", height: 60, marginBottom: 15 }}>
      <img alt="You" style={{ height: 30, width: 30, margin: "0px 7px 0px 12px", borderRadius: "50%" }} src={authedUser.photo}/>
      <TextField 
        hintText="Reply"
        hintStyle={{ fontSize: "0.9em" }}
        inputStyle={{ color: erfaraBlack }}
        underlineShow={false}
        value={this.state.reply}
        style={{ flexGrow: "1", margin: "0px 15px" }}
        onKeyPress={this.onKeyPress}
        onChange={(event, value) => { this.setState({ reply: value }) }}
      />
    </div>;
  }

  render() {
    const { feedItem, user } = this.props;
    const moment = Moment(feedItem.timestamp);
    return <div style={{ padding: "15px 0px 15px 0px", width: "100%" }}>
      <div style={{ display: "flex" }}>
        <div style={{ height: "100%" }}>
          <img alt="User" style={{ height: 50, width: 50, margin: "0 10px 10px 10px", marginRight: "20px", borderRadius: "50%", verticalAlign: "top" }} src={user.photo}/>
        </div>
        <div style={{ height: "100%", flexGrow: "1" }}>
          <div style={{ marginBottom: "0.6em" }}>
            <span style={{ color: darkBlack, fontSize: "0.9em", fontWeight: "500" }}>{user.name}</span>
            <span style={{ float: "right", color: minBlack, fontWeight: "500", fontSize: "0.75em" }}>{moment.fromNow()}</span>
          </div>
          <span style={{ color: lightBlack }}>{feedItem.message}</span>
          <div style={{ padding: "1.4em 0em", fontSize: "0.9em" }}><span className="reply-box" onClick={() => this.setState({ isReplyOpen: !this.state.isReplyOpen })}>Reply</span></div>
          {this.state.isReplyOpen && this.renderReplyBox() }
        </div>
      </div>
      <hr/>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);