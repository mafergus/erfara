import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { minBlack, darkBlack } from "material-ui/styles/colors"
import MapsPlace from 'material-ui/svg-icons/maps/place';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import { getDateString } from "utils/dateTimeHelpers";

const STYLE = {
  color: darkBlack,
  fontWeight: "normal",
  fontSize: "0.8em",
  display: "inline-block",
};

export default class EventDetails extends React.Component {

  static propTypes = {
    event: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { event } = this.props;
    const dateStr = new Date(event.date).toLocaleDateString("en-us", {year: 'numeric', day: "numeric" ,month: 'long', weekday: 'long'});
    const startTimeStr = new Date(event.startTime).toLocaleTimeString("en-us", {minute: 'numeric', hour: 'numeric'});
    const endTimeStr = new Date(event.endTime).toLocaleTimeString("en-us", {minute: 'numeric', hour: 'numeric'});
    return (
      <div style={{ backgroundColor: "white", border: "10px black", padding: "1em 0 1em 1em" }}>
        <span style={{ display: "block", marginBottom: "0.5em" }}>
          <ActionSchedule color={minBlack} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.8em" }}/>
            <a style={STYLE}>{dateStr}</a><br/>
            <a style={STYLE}>{startTimeStr}</a><a style={STYLE}>{endTimeStr}</a>
        </span>
        <span style={{ display: "block" }}>
          <MapsPlace color={minBlack} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.8em" }}/>
          <a style={STYLE}>{event.advices}</a><br/>
          <a style={STYLE}>{event.locationString}</a>
        </span>
      </div>
    );
  }
  
}