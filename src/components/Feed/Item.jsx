import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { erfaraBlack } from "utils/colors";
import { minBlack } from "material-ui/styles/colors";
import Moment from "moment";

const IMG_STYLE = {
  height: 50,
  width: 50,
  margin: "0 10px 10px 10px",
  marginRight: "20px",
  borderRadius: "50%",
  verticalAlign: "top",
};

function mapStateToProps(state, props) {
  return {
    user: state.users.get(props.userId),
  }
}

export class Item extends React.Component {
  
  static propTypes = {
    timestamp: PropTypes.string.isRequired,
    imageStyle: PropTypes.object,
    message: PropTypes.string.isRequired,
    style: PropTypes.object,
    user: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { user, imageStyle, timestamp, message, style } = this.props;
    const moment = new Moment(timestamp);
    if (!user) { return null; }
    return <div style={{ display: "flex", ...style }}>
      <div style={{ height: "100%" }}>
        <img alt="User" style={{ ...IMG_STYLE, ...imageStyle }} src={user.photo}/>
      </div>
      <div style={{ height: "100%", flexGrow: "1" }}>
        <div style={{ marginBottom: "0.6em" }}>
          <span style={{ color: erfaraBlack, fontSize: "0.9em", fontFamily: "Roboto-Medium" }}>{user.name}</span>
          <span style={{ float: "right", color: minBlack, fontWeight: "500", fontSize: "0.75em" }}>{moment.fromNow()}</span>
        </div>
        <span style={{ color: erfaraBlack }}>{message}</span>
      </div>
    </div>;
  }
}

export default connect(mapStateToProps)(Item);
