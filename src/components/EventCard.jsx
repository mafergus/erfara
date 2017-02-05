import React, { PropTypes } from "react";
import { connect } from 'react-redux';
import autoBind from "react-autobind";
import Card from "material-ui/Card";

export class EventCard extends React.Component {
  
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { title, description } = this.props
    return <Card style={{ height: "5em", width: "5em", backgroundColor: "red" }}>
      {title}
      {description}
    </Card>;
  }
}
