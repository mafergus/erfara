import React from "react";
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import ReactGoogleMapLoader from "react-google-maps-loader";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { GOOGLE_MAPS_API_KEY, DEFAULT_LOCATION } from "utils/constants";
import scriptLoader from 'react-async-script-loader';

export class GooglePlacesSuggest extends React.Component {

  static propTypes = {
    hintStyle: PropTypes.object,
    fontSize: PropTypes.string,
    onSelectSuggest: PropTypes.func.isRequired,
    suggestRadius: PropTypes.number,
    suggestTypes: PropTypes.array,
  };

  static defaultProps = {
    fontSize: "0.9em",
    hintStyle: {},
    suggestRadius: 100000,
    suggestTypes: [],
  };

  constructor() {
    super();

    this.state = {
      coordinate: null,
      googleMaps: null,
      focusedSuggestIndex: 0,
      selectedLabel: "",
      suggests: [],
    };
    this.text = "";
    // this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
        this.setState({ googleMaps: window.google.maps });
    }
  }

  handleSelectSuggest(suggest) {
    const { onSelectSuggest } = this.props;

    this.geocodeSuggest(suggest.description, () => {
      this.setState({ selectedLabel: suggest.description, suggests: []}, () => {
        onSelectSuggest(suggest, this.state.coordinate);
      });
    });
  }

  gotText(value) {
    this.text = value;
    this.updateSuggests(value);
  }

  updateSuggests(search) {
    const { suggestRadius, suggestTypes } = this.props;
    const { googleMaps } = this.state;
    const autocompleteService = new googleMaps.places.AutocompleteService();

    if (!search) {
      this.setState({suggests: []});
      return;
    }

    autocompleteService.getPlacePredictions({
      input: search,
      location: new googleMaps.LatLng(37.4419, -122.1430),
      radius: suggestRadius,
      types: suggestTypes,
    }, (googleSuggests) => {
      if (!googleSuggests) {
        this.setState({suggests: []});
        return;
      }

      this.setState({
        focusedSuggestIndex: 0,
        suggests: googleSuggests,
      });
    });
  }

  geocodeSuggest(suggestLabel, callback) {
    const { googleMaps } = this.state;
    const geocoder = new googleMaps.Geocoder();

    geocoder.geocode({ address: suggestLabel }, (results, status) => {
      if (status === googleMaps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        let neighborhood = "";
        let city = "";
        const neighborhoodObj = results[0].address_components.filter(component => component.types.includes("neighborhood"));
        if (neighborhoodObj && neighborhoodObj.length > 0) {
          neighborhood = neighborhoodObj[0].long_name;
        }
        const cityObj = results[0].address_components.filter(component => component.types.includes("locality"));
        if (cityObj && cityObj.length > 0) {
          city = cityObj[0].long_name;
        }
        const coordinate = {
          latitude: location.lat(),
          longitude: location.lng(),
          neighborhood,
          city,
          title: suggestLabel,
        };

        this.setState({coordinate}, callback);
      }
    });
  }

  render() {
    const { suggests } = this.state;
    const { hintStyle, fontSize } = this.props;
    const dataSourceConfig = { text: 'description', value: 'id'};

    return <AutoComplete
      hintText="Enter a location"
      hintStyle={{ fontSize, color: "#BDBDBD", ...hintStyle }}
      textFieldStyle={{ fontSize, paddingLeft: 10 }}
      filter={AutoComplete.noFilter}
      dataSource={suggests}
      dataSourceConfig={dataSourceConfig}
      listStyle={{ width: "100%", marginLeft: -8 }}
      underlineShow={false}
      onUpdateInput={(value, dataSource, params) => { this.gotText(value, suggests, params); }}
      onNewRequest={(chosenItem) => { this.handleSelectSuggest(chosenItem); }}
    />;
  }
}

export default scriptLoader([`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`])(GooglePlacesSuggest);
