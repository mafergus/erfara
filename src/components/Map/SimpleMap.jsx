import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_API_KEY, DEFAULT_LOCATION } from 'utils/constants';
import MapMarker from 'components/Map/MapMarker';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class SimpleMap extends Component {
  
  static defaultProps = {
    center: { lat: DEFAULT_LOCATION[0], lng: DEFAULT_LOCATION[1] },
    zoom: 8,
  }

  _onChildMouseEnter = (key, childProps) => {
    // const markerId = childProps.marker.get('id');
    // const index = this.props.markers.findIndex(m => m.get('id') === markerId);
    // if (this.props.onMarkerHover) {
    //   this.props.onMarkerHover(index);
    // }
  }

  _onChildMouseLeave = (/* key, childProps */) => {
    // if (this.props.onMarkerHover) {
    //   this.props.onMarkerHover(-1);
    // }
  }

  render() {
    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: [GOOGLE_MAPS_API_KEY] }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        onChildMouseEnter={this._onChildMouseEnter}
        onChildMouseLeave={this._onChildMouseLeave}
      >
        <MapMarker
          lat={ DEFAULT_LOCATION[0] }
          lng={ DEFAULT_LOCATION[1] }
        />
      </GoogleMapReact>
    );
  }
}