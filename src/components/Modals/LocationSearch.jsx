import React, { PropTypes } from "react";
import autoBind from "react-autobind";
//import TextField from "material-ui/TextField";
import AutoComplete from 'material-ui/AutoComplete';
import { addLocationSearchResults } from "actions/locationSearchActions";
import { autoCompletePlaces } from "utils/Api";
import store from "store/store";
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    locationSearch: state.locationSearch
  };
}

export class LocationSearch extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    locationSearch: PropTypes.array,
  };

  constructor() {
    super();
    autoBind(this);

    this.text = "";
    this.state = {
      isListOpen: true
    }
  }

  gotText(value, dataSource, params) {
    if (params) {
      this.text = value;
      if (this.text.length > 2 || this.text.length === 0) { 
        autoCompletePlaces(this.text).then(json => {
          const predictions = json.predictions;
          store.dispatch(addLocationSearchResults(predictions));
        });
      }
    }
  }

  render() {
    const dataSource = this.props.locationSearch;
    const dataSourceConfig = { text: 'description', value:'id'};
    const style = {
      textFieldStyle: {
        paddingLeft:"10px",
        width: "295px",
        fontSize:"12px"
      },
      hintStyle: {
        color: "#BDBDBD", 
        fontFamily: ".AppleSystemUIFont",
        fontSize: "12px"
      }
    }
    return (
      <div>
        <AutoComplete
          hintText="Enter a location"
          hintStyle={style.hintStyle}
          textFieldStyle={style.textFieldStyle}
          filter={AutoComplete.noFilter}
          dataSource={dataSource}
          dataSourceConfig={dataSourceConfig}
          listStyle={{width:'301px' ,marginLeft:"-8px"}}
          underlineShow={false}
          onUpdateInput={(value, dataSource, params) => {this.gotText(value, dataSource, params)}}
          open={this.state.isListOpen}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(LocationSearch);
