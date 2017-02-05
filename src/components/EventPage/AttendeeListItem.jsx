import React, { PropTypes } from "react";
import { Link } from "react-router";
import { darkBlack, lightBlack } from "material-ui/styles/colors";

export default function AttendeesListItem({ userId, name, image, location }) {
  return <Link to={`/users/${userId}`}>
    <li style={{ width: "93%", padding: "0.8em 0 0.8em 0.8em", display: "inline-block" }}>
      <img src={image} style={{ height: "2.5em", width: "2.5em", borderRadius: "50%", marginRight: "0.9em", verticalAlign: "middle" }}/>
      <div style={{ display: "inline-block", verticalAlign: "middle" }}>
        <div style={{ color: darkBlack, fontSize: "1em" }}>{name}</div>
        <div style={{ color: lightBlack, fontSize: "0.7em" }}>{location}</div>
      </div>
    </li>
  </Link>;
}

AttendeesListItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};