import _ from "lodash";
import React from "react";
import PropTypes from 'prop-types';
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { GOOGLE_MAPS_API_KEY, DEFAULT_LOCATION } from "utils/constants";

const LeMap = ({ markers }) => 
  <GoogleMap defaultOptions={{ mapTypeControl: false }}
          defaultZoom={8}
          defaultCenter={{ lat: DEFAULT_LOCATION[0], lng: DEFAULT_LOCATION[1] }} >
    {markers}
  </GoogleMap>;

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(LeMap);

const enhance = _.identity;

const ReactGoogleMaps = ({ markers }) => {
  return [
  <MyMapComponent key="map" markers={markers} />
  ];
};

export default enhance(ReactGoogleMaps);