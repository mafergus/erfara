import React from "react";
import autoBind from "react-autobind";
import { Link } from 'react-router';

export default class AdminPage extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    return <div style={{ backgroundColor: "green", width: "100%", height: "100%", paddingTop: 50, display: "flex" }}>
      <Link to="/admin/categories">
        <span style={{ width: 150, height: 150, marginLeft: 10, backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "black" }}>Activity Categories</p>
        </span>
      </Link>
      <Link to="/admin/users">
        <span style={{ width: 150, height: 150, marginLeft: 10, backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "black" }}>User Management</p>
        </span>
      </Link>
    </div>;
  }
}