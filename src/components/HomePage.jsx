import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import GoogleMap from 'google-map-react';
import EventsList from "components/EventList/EventsList";
import { erfaraBlack } from "utils/colors";
import { DEFAULT_LOCATION, GOOGLE_MAPS_API_KEY } from "utils/constants";
import GoogleMapLoader from "react-google-maps-loader";
import { flattenImmutableMap } from "utils/helpers";
import MapsPlace from "material-ui/svg-icons/maps/place";
import shouldPureComponentUpdate from "react-pure-render/function";
import { orange600 } from "material-ui/styles/colors";

const SUBTITLE_STYLE = {
  color: erfaraBlack,
  fontSize: "0.9em",
  fontFamily: "Roboto-Light",
};

function mapStateToProps(state) {
  return {
    events: flattenImmutableMap(state.events),
  };
}

export class HomePage extends React.Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    googleMaps: PropTypes.any,
  };

  static defaultProps = {
    googleMaps: {},
  };

  static renderHeaders() {
    return <div style={{ width: "100%", marginBottom: 35 }}>
      <h1 style={{ color: erfaraBlack, fontSize: "1.2em", fontFamily: "Roboto-Light" }}>Upcoming events recommended for you</h1>
      <div style={{ width: "100%", marginTop: 10 }}>
        <span style={{ ...SUBTITLE_STYLE, margin: 0, marginTop: 15 }}>Based on <span style={{ textDecoration: "underline" }}>Chess, Astronomy, Sports, +2 </span>&nbsp;&nbsp;|&nbsp;&nbsp;Around <span style={{ textDecoration: "underline" }}>Santa Clara, CA</span></span>
        <span style={{ ...SUBTITLE_STYLE, float: "right" }}>Category&nbsp;&nbsp;&nbsp;&nbsp;Filters</span>
      </div>
    </div>;
  }

  static renderList() {
    return <EventsList 
      header={HomePage.renderHeaders()}
      style={{ width: "100%", marginTop: 30 }}
      hasFeatured={false}
    />;
  }

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isPopupOpen: false,
      center: DEFAULT_LOCATION,
      zoom: 10,
    };
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  clickMarker(event) {
    this.setState({
      selectedEvent: event,
      isPopupOpen: true,
      center: geoArray
    });
  }

  renderMap() {
    const { events, googleMaps } = this.props;
    const markers = events.map(item => {
      return <div
          key={item.id}
          lat={item.geoCoordinates.latitude}
          lng={item.geoCoordinates.longitude}
      >
        <MapsPlace
          style={{ height: 35, width: 35, marginTop: -30, marginLeft: -17 }}
          color={orange600} 
          hoverColor={orange600}
        />
      </div>;
    });

    return (
      <div style={{ width: "100%", height: 240 }}>
        <GoogleMap
          defaultCenter={DEFAULT_LOCATION}
          defaultZoom={9}
          googleMapLoader={() => new Promise(resolve => resolve(googleMaps))}
        >
          {markers}
        </GoogleMap>
      </div>
    );
  }

  render() {
    return <div>
      {this.renderMap()}
      {HomePage.renderList()}
    </div>;
  }
}

export default GoogleMapLoader(connect(mapStateToProps)(HomePage), {
  libraries: ["places"],
  key: GOOGLE_MAPS_API_KEY,
});