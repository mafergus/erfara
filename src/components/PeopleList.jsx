import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import pluralize from "pluralize";
import { erfaraBlack } from "utils/colors";

export default class PeopleList extends React.Component {

  static propTypes = {
    people: PropTypes.array,
    peopleType: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { people, peopleType, style, className } = this.props;
    return <div className={`attendeesList border ${className}`} style={{ ...style, backgroundColor: "white", padding: "0.9em 0 0.5em 0" }}>
      <span style={{ color: erfaraBlack, fontSize: "1em", padding: "0em 1em" }}>{pluralize(peopleType, people.length, true)}</span>
      <hr style={{ margin: "0.8em 1em" }} />
      {people}
    </div>;
  }
  
}