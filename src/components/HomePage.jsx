import React from "react";
import autoBind from "react-autobind";
// import SimpleMap from "components/SimpleMap";

export default class HomePage extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    return <div>
      <div style={{ width: "100%", height: 150, backgroundColor: "yellow" }}/>
    </div>;
  }
}