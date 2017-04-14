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
    if (!attendees) { return null; }
    if (extended) {
      children = attendees.map(user => user && <img alt="Attendee" key={user.uid} style={{ height: 26, width: 26, borderRadius: "50%", objectFit: "cover", marginRight: PADDING }} src={user.photo}/>);
    } else {
      children.push(attendees[0] && <img alt="Attendee" key={attendees[0].uid} style={{ height: 26, width: 26, borderRadius: "50%", objectFit: "cover", marginRight: PADDING }} src={attendees[0] && attendees[0].photo}/>);
      if (attendees.length > 1) {
        children.push(<div key="123" style={{ height: 29, width: 29, borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.12)", display: "inline-block", marginRight: PADDING }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <span style={{ color: lightBlack, verticalAlign: "middle", fontSize: "0.8em" }}>{`+${attendees.length-1}`}</span>
          </div>
        </div>);
      }
    }

    return <div style={{ display: "flex", alignItems: "center", marginRight: 2 }}>
      {children}
    </div>;
  }
}