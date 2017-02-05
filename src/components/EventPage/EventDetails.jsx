import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { minBlack, lightBlack, darkBlack } from "material-ui/styles/colors"
import MapsPlace from 'material-ui/svg-icons/maps/place';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import { getDateString } from "../../utils/dateTimeHelpers";

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
    const dateStr = getDateString(new Date(event.date));
    return <div style={{ backgroundColor: "white", border: "10px black", padding: "1em 0 1em 1em" }}>
      <span style={{ display: "block", marginBottom: "0.5em" }}>
        <MapsPlace color={minBlack} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.8em" }}/>
        <a style={STYLE}>{dateStr}</a>
      </span>
      <span style={{ display: "block" }}>
        <ActionSchedule color={minBlack} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.8em" }}/>
        <a style={STYLE}>The Old Pro, 541 Ramona St, Palo Alto, CA 94301, USA</a>
      </span>
    </div>;
  }
  
}