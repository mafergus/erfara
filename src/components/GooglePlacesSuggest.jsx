import React, { PropTypes } from "react";
import AutoComplete from 'material-ui/AutoComplete';
import GoogleMapLoader from "react-google-maps-loader";
import { GOOGLE_MAPS_API_KEY } from "utils/constants";

export class GooglePlacesSuggest extends React.Component {

  static propTypes = {
    googleMaps: PropTypes.object.isRequired,
    hintStyle: PropTypes.object,
    onSelectSuggest: PropTypes.func.isRequired,
    suggestRadius: PropTypes.number,
    suggestTypes: PropTypes.array,
  };

  static defaultProps = {
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
    const { googleMaps, suggestRadius, suggestTypes } = this.props;
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
    const {googleMaps} = this.props;
    const geocoder = new googleMaps.Geocoder();

    geocoder.geocode({address: suggestLabel}, (results, status) => {
      if (status === googleMaps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        const coordinate = {
          latitude: location.lat(),
          longitude: location.lng(),
          title: suggestLabel,
        };

        this.setState({coordinate}, callback);
      }
    });
  }

  render() {
    const { suggests } = this.state;
    const { hintStyle } = this.props;
    const dataSourceConfig = { text: 'description', value: 'id'};

    return <AutoComplete
      hintText="Enter a location"
      hintStyle={{ fontSize: "1em", color: "#BDBDBD", ...hintStyle }}
      textFieldStyle={{ fontSize: "1em", paddingLeft: 10 }}
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

export default GoogleMapLoader(GooglePlacesSuggest, {
  libraries: ["places"],
  key: GOOGLE_MAPS_API_KEY,
});
