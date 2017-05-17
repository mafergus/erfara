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
      <div style={{ width: "100%", marginTop: 10 }}>
        <h3 style={{ color: erfaraBlack, margin: 0, display: "inline-block" }}>Upcoming events near you</h3>
        <h4 style={{ margin: 0, float: "right" }}>Events&nbsp;&nbsp;&nbsp;&nbsp;People</h4>
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