import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { erfaraBlack, darkGray } from "utils/colors";
import Alarm from 'material-ui/svg-icons/action/alarm';
import Place from 'material-ui/svg-icons/maps/place';

// const STYLE = {
//   color: darkBlack,
//   fontWeight: "normal",
//   fontSize: "0.8em",
//   display: "inline-block",
// };

export default class EventDetails extends React.Component {

  static propTypes = {
    event: PropTypes.object,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  renderListItem(Icon, title, subtitle) {
    return <div style={{ width: "100%", display: "flex", marginBottom: 32 }}>
      <div style={{ height: "100%", margin: "6px 18px 0px 0px" }}>
        <Icon style={{ color: darkGray }}/>
      </div>
      <div style={{ flexGrow: "1" }}>
        <p style={{ color: erfaraBlack, fontSize: "0.9em", marginBottom: "0.4em" }}>{title}</p>
        <p style={{ color: darkGray, fontSize: "0.8em" }}>{subtitle}</p>
      </div>
    </div>;
  }

  render() {
    const { event, style } = this.props;
    const dateStr = new Date(event.date).toLocaleDateString("en-us", {year: 'numeric', day: "numeric", month: 'long', weekday: 'long'});
    const startTimeStr = new Date(event.startTime).toLocaleTimeString("en-us", {minute: 'numeric', hour: 'numeric'});
    const endTimeStr = new Date(event.endTime).toLocaleTimeString("en-us", {minute: 'numeric', hour: 'numeric'});
    return (
      <div className="border light-shadow" style={{ ...style, backgroundColor: "white", padding: "1.7em 1.7em 0.9em 1.7em", display: "flex" }}>
        <div style={{ height: "100%", width: "25%", display: "inline-block" }}>
          <span style={{ color: erfaraBlack, fontSize: "1em" }}>Time and Place</span>
          <hr style={{ margin: "10px 0px 20px 0px" }} />
          {this.renderListItem(Alarm, dateStr, startTimeStr + "-" + endTimeStr)}
          {this.renderListItem(Place, event.locationString)}
        </div>
        <div style={{ height: "100%", width: "50%", display: "inline-block", padding: "0 80px" }}>
          <span style={{ color: erfaraBlack, fontSize: "1em" }}>Details</span>
          <hr style={{ margin: "10px 0px 20px 0px" }} />
          <p style={{ fontSize: "0.9em", color: erfaraBlack }}>{event.description}</p>
        </div>
        <div style={{ height: "100%", width: "25%", display: "inline-block" }}>
          <span style={{ color: erfaraBlack, fontSize: "1em" }}>What to bring</span>
          <hr style={{ margin: "10px 0px 20px 0px" }} />
          <p style={{ fontSize: "0.9em", color: erfaraBlack }}>{event.advices && event.advices.length > 1 ? event.advices : "Just yourself!"}</p>
        </div>
      </div>
    );
  }
  
}