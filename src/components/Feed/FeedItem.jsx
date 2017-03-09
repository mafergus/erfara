import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { bindActionCreators } from "redux";
import { darkBlack, lightBlack, minBlack } from "material-ui/styles/colors";
import { darkGray } from "utils/colors";
import { getUser } from "actions/userActions";
import Moment from "moment";

function mapStateToProps(state, props) {
  return {
    user: state.users.get(props.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class FeedItem extends React.Component {

  static propTypes = {
    feedItem: PropTypes.object,
    getUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
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
          <div style={{ padding: "1.4em 0em", fontSize: "0.9em" }}><span className="hoverable" style={{ color: darkGray }} onClick={() => alert("BOOM")}>Reply</span></div>
        </div>
      </div>
      <hr/>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);