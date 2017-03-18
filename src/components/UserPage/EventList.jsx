import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { Link } from 'react-router';
import pluralize from "pluralize";
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
    const photo = event.photo;
    const STYLE = {
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: 80,
      borderRadius: 2,
      marginBottom: "0.3em",
      backgroundImage: `url(${photo})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
      backgroundBlendMode: "multiply",
      backgroundColor: "rgba(0,0,0,0.35)",
    };
    return <Link to={`/event/${eventId}`} style={{ textDecoration: "none" }}>
      <div key={eventId} style={STYLE} >
        <p style={{ width: "100%", textAlign: "center", color: "white" }}>{event.title}</p>
      </div>
    </Link>;
  }

  render() {
    const { events, title, className, style } = this.props;
    if (!events) { return null; }
    return <div className={`attendeesList border ${className}`} style={{ ...style, backgroundColor: "white", padding: "0.9em 0 0.5em 0" }}>
      <span style={{ color: erfaraBlack, fontSize: "1em", padding: "0em 1em" }}>{pluralize("event", Object.keys(events).length, true)} {title}</span>
      <hr style={{ margin: "0.8em 1em" }} />
      <div style={{ margin: "0em 1em" }}>
        {Object.entries(events).map(event => this.renderItem(event[0], event[1]))}
      </div>
    </div>;
  }
}
