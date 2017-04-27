import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import GoogleMap from 'google-map-react';
import EventsList from "components/EventList/EventsList";
import { erfaraBlack } from "utils/colors";
import { DEFAULT_LOCATION, GOOGLE_MAPS_API_KEY } from "utils/constants";
import MapMarker from 'components/MapMarker';
import EventListItem from "components/EventList/EventListItem";
import GoogleMapLoader from "react-google-maps-loader";

const SUBTITLE_STYLE = {
  color: erfaraBlack,
  fontSize: "0.9em",
  fontFamily: "Roboto-Light",
};

function mapStateToProps(state) {
  return {
    events: state.events.valueSeq().length > 0 ? state.events.length.valueSeq() : [],
  };
}

export class HomePage extends React.Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    googleMaps: PropTypes.any,
    zoom: PropTypes.number.isRequired,
  };

  static defaultProps = {
    center: DEFAULT_LOCATION,
    googleMaps: {},
    zoom: 10,
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
      isHovered: false,
      center: DEFAULT_LOCATION,
    };
  }

  clickMarker(event) {
    this.setState({
      selectedEvent: event,
      isPopupOpen: true,
      center: geoArray
    });
  }

  getHoverState(value) {
    this.setState({isHovered: value});
  }

  renderMap() {
    const { events, googleMaps } = this.props;
    const markers = events.filter(item => item.geoCoordinates)
                         .map(item => 
                            <MapMarker
                              clickMarker={this.clickMarker}
                              sendHoverState={this.getHoverState}
                              event={item}
                              lat={item.geoCoordinates.lat} 
                              lng={item.geoCoordinates.lng}
                              key={item.geoCoordinates}
                            />);

    return (
      <div style={{ width: "100%", height: 240 }}>
        <GoogleMap
          zoom={this.props.zoom}
          center={this.state.center}
          options={{disableDoubleClickZoom: this.state.isHovered ? true : false}}
          googleMapLoader={() => new Promise(resolve => resolve(googleMaps))}
        >
          {markers}
          {this.state.isPopupOpen && <EventListItem
            event={this.state.selectedEvent}
            mouseOver={this.mouseEnter}
            mouseOut={this.mouseLeave}
            key={this.state.selectedEvent.uid}
            marginConstant={index}
            popUp
          />}
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