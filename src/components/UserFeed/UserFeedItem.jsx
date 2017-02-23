import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { bindActionCreators } from "redux";
import { getUser } from "actions/userActions";
import { formatDate } from "utils/dateTimeHelpers";
import { darkBlack, lightBlack, minBlack } from "material-ui/styles/colors";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
    user: state.users.get(props.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class UserFeedItem extends React.Component {

  static propTypes = {
    feedItem: PropTypes.object,
    userId: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { userId, getUser } = this.props;
    if (userId) {
      getUser(userId);
    }
  }

  render() {
    //const { feedItem, user } = this.props;
    const timeStr = formatDate(this.props.feedItem.timestamp, false);
    return (
      <div style={{ display: "flex", padding: "15px 0px 15px 0px", width: "100%" }} className="hover">
        <div>
          <img alt="User photo" style={{ height: "40px", width: "40px", margin: "10px", marginRight: "20px", borderRadius: "50%", verticalAlign: "top" }} src={this.props.authedUser.photo}/>
        </div>
        <div style={{ height: "100%", flexGrow: "1" }}>
          <div style={{ marginBottom: "0.6em" }}>
            <span style={{ color: darkBlack, fontSize: "0.9em", fontWeight: "500" }}>{this.props.authedUser.name}</span>
            <span style={{ float: "right", color: minBlack, fontWeight: "500", fontSize: "0.75em" }}>{timeStr}</span>
          </div>
          <span style={{ color: lightBlack }}>{this.props.feedItem.feedback}</span>
        </div>
        <hr/>
      </div> 
    );
    // return (
    //   <div>
    //     <h2 style={{ color: darkBlack }}>{this.props.feedItem.feedback}</h2>
    //   </div>
    // );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFeedItem);