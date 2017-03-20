import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import GoogleMap from 'google-map-react';
import EventsList from "components/EventList/EventList";
import { erfaraBlack } from "utils/colors";
import { DEFAULT_LOCATION } from "utils/constants";
import MapsPlace from "material-ui/svg-icons/maps/place"; 
import { red500 } from 'material-ui/styles/colors';

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

export class HomePage extends React.Component {

  static propTypes = {
    events: PropTypes.object,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
  };

  static defaultProps = {
    center: DEFAULT_LOCATION,
    zoom: 10,
  };

  constructor() {
    super();
    autoBind(this);
  }

  renderMap() {
    const { events } = this.props;
    const Marker = events.filter(item => item.geoCoordinates)
                         .map((item, index) => <MapsPlace color={red500} lat={item.geoCoordinates.lat} lng={item.geoCoordinates.lng} key={index} />);
    return (
      <div style={{ width: "100%", height: 240 }}>
        <GoogleMap
          bootstrapURLKeys={{ key: "AIzaSyAlndrl6ZoeFfv0UURwByPWrxPbpYBAXEk" }}
          zoom={this.props.zoom}
          center={this.props.center}
        >
        {Marker}
        </GoogleMap>
      </div>
    );
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

export default connect(mapStateToProps)(HomePage);