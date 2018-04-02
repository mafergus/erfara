import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_API_KEY, DEFAULT_LOCATION } from 'utils/constants';
import MapMarker from 'components/Map/MapMarker';
import MapCard from 'components/Map/MapCard';

export default class SimpleMap extends Component {

  static propTypes = {
    center: PropTypes.object,
    events: PropTypes.array,
    zoom: PropTypes.number,
  };
  
  static defaultProps = {
    center: { lat: DEFAULT_LOCATION[0], lng: DEFAULT_LOCATION[1] },
    events: null,
    zoom: 8,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      hoveredMarker: -1,
    };
  }

  onMarkerEnter(event) {
    this.setState({ hoveredMarker: event });
  }

  onMarkerExit() {
    this.setState({ hoveredMarker: -1 });
  }

  renderEventCard() {
    const { hoveredMarker } = this.state;

    if (this.state.hoveredMarker !== -1) {
      return <MapCard 
        key={hoveredMarker.id}
        lat={hoveredMarker.geoCoordinates.latitude}
        lng={hoveredMarker.geoCoordinates.longitude}
        event={hoveredMarker}
        eventUid={hoveredMarker.id}
      />;
    }
  }

  render() {
    const { events } = this.props;
    const markers = events.map(item => {
      return item[1].geoCoordinates && <MapMarker
        key={item[0]}
        lat={item[1].geoCoordinates.latitude}
        lng={item[1].geoCoordinates.longitude}
        event={{ ...item[1], id: item[0] }}
        hovered={item[0] === this.state.hoveredMarker.uid}
        onMouseOver={this.onMarkerEnter}
        onMouseExit={this.onMarkerExit}
      />;
    });

    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: [GOOGLE_MAPS_API_KEY] }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        onChildMouseEnter={this._onChildMouseEnter}
        onChildMouseLeave={this._onChildMouseLeave}
      >
        {markers}
        {this.renderEventCard()}
      </GoogleMapReact>
    );
  }
}