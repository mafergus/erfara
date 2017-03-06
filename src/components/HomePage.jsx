import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import GoogleMap from 'google-map-react';
import EventsList from "components/EventList/EventList";
import { erfaraBlack } from "utils/colors";

export default class HomePage extends React.Component {

  static propTypes = {
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
  };

  static defaultProps = {
    center: [37.65459, -122.2037],
    zoom: 10,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  renderMap() {
    return <div style={{ width: "100%", height: 240 }}>
      <GoogleMap 
        zoom={this.props.zoom}
        center={this.props.center}
      >
      </GoogleMap>
    </div>;
  }

  renderHeaders() {
    const SUBTITLE_STYLE = {
      color: erfaraBlack,
      fontSize: "0.9em",
      fontFamily: "Roboto-Light",
    };

    return <div style={{ width: "100%", marginBottom: 35 }}>
      <h1 style={{ color: erfaraBlack, fontSize: "1.2em", fontFamily: "Roboto-Light" }}>Upcoming events recommended for you</h1>
      <div style={{ width: "100%", marginTop: 10 }}>
        <span style={{ ...SUBTITLE_STYLE, margin: 0, marginTop: 15 }}>Based on <span style={{ textDecoration: "underline" }}>Chess, Astronomy, Sports, +2 </span>&nbsp;&nbsp;|&nbsp;&nbsp;Around <span style={{ textDecoration: "underline" }}>Santa Clara, CA</span></span>
        <span style={{ ...SUBTITLE_STYLE, float: "right" }}>Category&nbsp;&nbsp;&nbsp;&nbsp;Filters</span>
      </div>
    </div>;
  }

  renderList() {
    return <EventsList 
      header={this.renderHeaders()}
      itemStyle={{ width: 550 }}
      style={{ width: "100%", marginTop: 30 }}
      hasFeatured={false}
    />;
  }

  render() {
    return <div>
      {this.renderMap()}
      {this.renderList()}
    </div>;
  }
}