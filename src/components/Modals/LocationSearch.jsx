import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import AutoComplete from 'material-ui/AutoComplete';
import { addLocationSearchResults } from "actions/locationSearchActions";
import { autoCompletePlaces, getCoordinates } from "utils/Api";
import store from "store/store";
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    locationSearch: state.locationSearch,
  };
}


export class LocationSearch extends React.Component {
  static propTypes = {
    locationSearch: PropTypes.array.isRequired,
    onSelectLocation: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.text = "";
    this.state = {
      locationString: "",
    };
  }

  sendLocationToModal(location, id) {
    const { onSelectLocation } = this.props;
    getCoordinates(id).then(json => {
      const coordinateObj = json.result.geometry.location;
      onSelectLocation(location, coordinateObj);
    });
  }

  gotText(value, dataSource, params) {
    this.text = value;
    if (params && (this.text.length > 2 || this.text.length === 0)) { 
      autoCompletePlaces(this.text).then(json => {
        const { predictions } = json;
        store.dispatch(addLocationSearchResults(predictions));
      });
    }
  }

  render() {
    const { locationSearch } = this.props;
    const dataSourceConfig = { text: 'description', value: 'id'};
    const style = {
      textFieldStyle: {
        paddingLeft: "10px",
        width: "295px",
        fontSize: "12px"
      },
      hintStyle: {
        color: "#BDBDBD", 
        fontSize: "12px"
      }
    };
    return (
      <div>
        <AutoComplete
          hintText="Enter a location"
          hintStyle={style.hintStyle}
          textFieldStyle={style.textFieldStyle}
          filter={AutoComplete.noFilter}
          dataSource={locationSearch}
          dataSourceConfig={dataSourceConfig}
          listStyle={{ width: 301, marginLeft: -8 }}
          underlineShow={false}
          onUpdateInput={(value, dataSource, params) => { this.gotText(value, locationSearch, params); }}
          onNewRequest={(chosenItem) => { this.sendLocationToModal(chosenItem.description, chosenItem.place_id); }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(LocationSearch);

