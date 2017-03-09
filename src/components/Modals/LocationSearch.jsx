import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import TextField from "material-ui/TextField";
import { addLocationSearchResults } from "actions/locationSearchActions";
import { autoCompletePlaces } from "utils/Api";
import store from "store/store"; 

export default class LocationSearch extends React.Component {

  static propTypes = {
    text: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);

    this.text = "";
  }

  gotText(event, value) {
    if (event) {
      this.text = value;
      if (this.text.length > 2) {
        autoCompletePlaces(this.text).then(json => {
          const predictions = json.predictions;
          store.dispatch(addLocationSearchResults(predictions));
        });
      }
    }
  }

  render() {
    return <div>
      <TextField 
        name="Search location"
        hintText="Search location"
        onChange={(event, value) => this.gotText(event, value)}
      />
    </div>;
  }
}

