import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { darkBlack, faintBlack } from "material-ui/styles/colors";

export default class PeopleList extends React.Component {

  static propTypes = {
    people: PropTypes.array,
    peopleType: PropTypes.string,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { people, peopleType } = this.props;
    const style = {
      ...this.props.style,
      padding: "0 0 0 0",
      border: `1px solid ${faintBlack}`,
      borderRadius: "1%",
    }
    return <div className="attendeesList" style={style}>
      <a style={{ fontSize: "1em", color: darkBlack, margin: "0.5em 5em 0.5em 0", lineHeight: "2em", width: "100%", paddingLeft: "0.7em" }}>{people.length} {peopleType}</a>
      <hr style={{ margin: "0 0.4em 0 0.4em" }}/>
      {people}
    </div>;
  }
  
}