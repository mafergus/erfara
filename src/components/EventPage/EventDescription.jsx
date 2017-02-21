import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { lightBlack } from "material-ui/styles/colors"

export default class EventDescription extends React.Component {

  static PropTypes = {
    event: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { event } = this.props;
    return <div style={{ backgroundColor: "white", padding: "1.4em" }}>
      <a style={{ color: lightBlack }}>
        {event.description}    
      </a>
    </div>;
  }
  
}