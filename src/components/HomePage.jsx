import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import GoogleMap from 'google-map-react';
import EventsList from "components/EventList/EventList";

export default class HomePage extends React.Component {

  static propTypes = {
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
  };

  static defaultProps = {
    center: [37.8272, -122.2913],
    zoom: 10,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  renderMap() {
    return <div style={{ width: "100%", height: 200 }}>
      <GoogleMap 
        zoom={this.props.zoom}
        center={this.props.center}
      >
      </GoogleMap>
    </div>;
  }

  renderHeaders() {
    return <div>
      <h1>Upcoming events recommended for you</h1>
      <h5>Based on Chess, Astronomy, Sports, +2 | Around Santa Clara, CA</h5>
    </div>;
  }

  renderList() {
    return <EventsList itemStyle={{ width: 550 }} style={{ width: "100%" }}/>;
  }

  render() {
    return <div>
      {this.renderMap()}
      {this.renderHeaders()}
      {this.renderList()}
    </div>;
  }
}