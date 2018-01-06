import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import pluralize from "pluralize";
import { erfaraBlack } from "utils/colors";

export default class PeopleList extends React.Component {

  static defaultProps = {
    isTitlePlural: true,
  };

  static propTypes = {
    people: PropTypes.array.isRequired,
    peopleType: PropTypes.string,
    isTitlePlural: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: "",
    style: {},
    peopleType: "People",
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { people, peopleType, style, className, isTitlePlural } = this.props;
    return <div className={`attendeesList border ${className}`} style={{ ...style, backgroundColor: "white", padding: "0.9em 0 0.5em 0" }}>
      <span style={{ color: erfaraBlack, fontSize: "1em", padding: "0em 1em" }}>{isTitlePlural ? pluralize(peopleType, people.length, true) : `${people.length} ${peopleType}`}</span>
      <hr style={{ margin: "0.8em 1em" }} />
      {people}
    </div>;
  }
  
}