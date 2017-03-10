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
        <TextField 
          name="Search location"
          hintText="Search location"
          hintStyle={style.hintStyle}
          underlineShow={false}
          style={style.textFieldStyle}
          onChange={(event, value) => this.gotText(event, value)}
        />
      </div>
    );
  }
}

