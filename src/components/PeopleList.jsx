import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { erfaraBlack } from "utils/colors";

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
    const { people, peopleType, style } = this.props;
    return <div className="attendeesList border" style={{ ...style, backgroundColor: "white", padding: "1.3em 0 0.5em 0" }}>
      <span style={{ color: erfaraBlack, fontSize: "1em", padding: "0em 1.5em" }}>{people.length} {peopleType}</span>
      <hr style={{ margin: "10px 0px 10px 0px", padding: "0em 1.5em" }} />
      {people}
    </div>;
  }
  
}