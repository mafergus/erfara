import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { Link } from 'react-router';
import pluralize from "pluralize";
import { erfaraBlack} from "utils/colors";

export default class EventList extends React.Component {
  
  static propTypes = {
    events: PropTypes.array.isRequired,
    title: PropTypes.string,
    className: PropTypes.any,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: "",
    style: {},
    title: "events",
  };

  static renderItem(eventId, event) {
    const { photo } = event;
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
    return <Link key={eventId} to={`/event/${eventId}`} style={{ textDecoration: "none" }}>
      <div style={STYLE} className="user-events-list-item">
        <p style={{ width: "100%", textAlign: "center", color: "white" }}>{event.title}</p>
      </div>
    </Link>;
  }

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { events, title, className, style } = this.props;
    if (!events) { return null; }
    return <div
      className={`attendeesList border ${className}`}
      style={{ ...style, backgroundColor: "white", padding: "0.9em 0 0.5em 0" }}
    >
      <span style={{ color: erfaraBlack, fontSize: "1em", padding: "0em 1em" }}>
        {pluralize("event", events.length, true)} {title}
      </span>
      <hr style={{ margin: "0.8em 1em" }} />
      <div style={{ margin: "0em 1em" }}>
        {events.map(event => EventList.renderItem(event.id, event))}
      </div>
    </div>;
  }
}
