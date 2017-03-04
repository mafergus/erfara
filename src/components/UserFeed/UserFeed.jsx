import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { faintBlack } from "material-ui/styles/colors";
import TextField from "material-ui/TextField";
import { addUserFeedback } from "actions/userActions";
import store from "store/store";
import UserFeedItem from "components/UserFeed/UserFeedItem";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
  };
}

export class UserFeed extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    authedUser: PropTypes.object,
    user: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
    this.state = { feedback: "" };
  }

  onSendClicked() {
    store.dispatch(addUserFeedback(this.props.authedUser.uid, this.props.user.uid, this.state.feedback, new Date()));
    this.setState({ feedback: "" });
  }

  onKeyPress(event) {
    if (event.charCode === 13) { // enter key pressed
      this.onSendClicked();  
    } 
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  renderFeedItem(key, item) {
    const { userId } = item;
    return <UserFeedItem key={key} userId={userId} feedItem={item} />;
  }

  renderMessageBar() {
    const STYLE = {
      display: "flex",
      justifyContent: "center",
      borderTop: `1px solid ${faintBlack}`,
      borderBottom: `1px solid ${faintBlack}`,
    };
    return <div style={STYLE}>
      <img src={this.props.authedUser.photo} alt="You" style={{ height: "40px", width: "40px", margin: "10px", borderRadius: "50%" }} />
      <div style={{ flexGrow: "1", height: "100%", alignSelf: "center" }}>
        <TextField 
          hintText="Message"
          value={this.state.feedback}
          style={{ width: "90%", marginLeft: "10px", marginRight: "10px" }}
          onKeyPress={this.onKeyPress}
          onChange={ (event, value) => { this.setState({ feedback: value }) }} />
      </div>
    </div>;
  }

  render() {
    const { style, authedUser } = this.props;
    const feed = this.props.user.feed;
    return <div style={{ ...style, borderTop: `1px solid ${faintBlack}` }}>
      {feed && Object.entries(feed).map(item => this.renderFeedItem(item[0], item[1]))}
      { authedUser.uid ? this.renderMessageBar() : null }
    </div>;
  }
}

export default connect(mapStateToProps)(UserFeed);