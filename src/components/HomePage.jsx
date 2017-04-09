import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import GoogleMap from 'google-map-react';
import EventsList from "components/EventList/EventList";
import { erfaraBlack } from "utils/colors";
import { DEFAULT_LOCATION } from "utils/constants";
import Markers from './Markers';

export default class HomePage extends React.Component {

  static propTypes = {
    eventEntry: PropTypes.array,
    events: PropTypes.object,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    isOpen: PropTypes.bool,
    markerId: PropTypes.string
  };

  static defaultProps = {
    center: DEFAULT_LOCATION,
    zoom: 10,
  };

  constructor() {
    super();
    autoBind(this);

    this.markerId = ""
    this.state = {
      cardPopup: [<div></div>],
      isPopupOpen: false,
      isHovered: false,
      center: DEFAULT_LOCATION,
    };
  }

  clickMarker(item, itemId, geoArray) {
    this.setState({ center: geoArray });
    this.setState({ cardPopup: item, isPopupOpen: true });

    if(this.markerId === itemId) {
      this.setState({ isPopupOpen: !this.state.isPopupOpen});
      this.markerId = "";
    }
    this.markerId = itemId;
  }

  getHoverState(value) {
    this.setState({isHovered: value});
  }

  renderMap() {
    const events = this.props.events;
    const Marker = events.filter(item => item.geoCoordinates)
                         .map((item, index) => 
                            <Markers
                              clickMarker={this.clickMarker}
                              sendHoverState={this.getHoverState}
                              event={item}
                              eventEntry={this.props.eventEntry}
                              lat={item.geoCoordinates.lat} 
                              lng={item.geoCoordinates.lng}
                              key={index}
                            />);

    const cardPopup = this.state.cardPopup.map((item) => this.state.isPopupOpen ? item : null);

    return (
      <div style={{ width: "100%", height: 240 }}>
        <GoogleMap
          bootstrapURLKeys={{ key: "AIzaSyAlndrl6ZoeFfv0UURwByPWrxPbpYBAXEk" }}
          zoom={this.props.zoom}
          center={this.state.center}
          options={{disableDoubleClickZoom: this.state.isHovered ? true : false}}
        >
          {Marker}
          {cardPopup}
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