import React from "react";


export default class SearchBox extends React.Component {

  static propTypes = {
    placeholder: React.PropTypes.string,
    onPlacesChanged: React.PropTypes.func
  }

  onPlacesChanged() {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }

  componentDidMount() {
    var input = this.refs.input.value
    this.searchBox = window.google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }

  componentWillUnmount() {
    this.searchBox.removeListener('places_changed', this.onPlacesChanged);
  }

  render() {
    return (
      <div>
        <input ref="input" {...this.props} type="text"/>;
      </div>
    );
  }
}

