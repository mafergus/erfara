import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { erfaraBlack} from "utils/colors";

export default class EventList extends React.Component {
  
  static propTypes = {
    events: PropTypes.object.isRequired,
    title: PropTypes.string,
    className: PropTypes.any,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  renderItem(eventId, event) {
    const STYLE = {
      width: 200,
      height: 50,
      borderRadius: 2,
      marginBottom: "0.3em",
      backgroundImage: `url(${event.photo})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
    };
    return <div key={eventId} style={STYLE}>
    </div>;
  }

  render() {
    const { events, title, className, style } = this.props;
    if (!events) { return null; }
    return <div className={`attendeesList border ${className}`} style={{ ...style, backgroundColor: "white", padding: "0.9em 0 0.5em 0" }}>
      <span style={{ color: erfaraBlack, fontSize: "1em", padding: "0em 1em" }}>{events.length} {title}</span>
      <hr style={{ margin: "0.8em 1em" }} />
      {Object.entries(events).map(event => this.renderItem(event[0], event[1]))}
    </div>;
  }
}
