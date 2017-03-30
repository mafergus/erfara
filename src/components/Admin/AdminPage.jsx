import React from "react";
import autoBind from "react-autobind";
import { Link } from 'react-router';

export default class AdminPage extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    return <div style={{ backgroundColor: "green", width: "100%", height: "100%", paddingTop: 50 }}>
      <Link to="/admin/categories">
        <div style={{ width: 150, height: 150, backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "black" }}>Activity Categories</p>
        </div>
      </Link>
    </div>;
  }
}