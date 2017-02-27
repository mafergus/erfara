import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { lightBlack } from "material-ui/styles/colors";

const PADDING = 10;

export default class Attendees extends React.Component {

  static propTypes = {
    extended: PropTypes.bool,
    attendees: PropTypes.array,
  }

  static defaultProps = {
    extended: false,
  }
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { extended, attendees } = this.props;
    let children = [];
    if (!attendees) return null;
    if (extended) {
      children = attendees.map(user => <img style={{ height: 26, width: 26, borderRadius: "50%", objectFit: "cover", marginRight: PADDING }} src={user.photo}/>);
    } else {
      children.push(<img style={{ height: 26, width: 26, borderRadius: "50%", objectFit: "cover", marginRight: PADDING }} src={attendees[0].photo}/>);
      if (attendees.length > 1) {
        children.push(<div style={{ height: 29, width: 29, borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.12)", display: "inline-block", marginRight: PADDING }}>
          <span style={{ color: lightBlack, verticalAlign: "middle", fontSize: "0.8em" }}>{`+${attendees.length-1}`}</span>
        </div>);
      }
    }

    return <div style={{ display: "flex", alignItems: "center", marginRight: 2 }}>
      {children}
    </div>
  }
}