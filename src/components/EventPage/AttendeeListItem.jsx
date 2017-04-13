import React, { PropTypes } from "react";
import { Link } from "react-router";
import { darkBlack, lightBlack } from "material-ui/styles/colors";
import { USER_PLACEHOLDER } from "utils/constants";

export default function AttendeesListItem({ userId, name, image, location }) {
  return <Link to={`/users/${userId}`} style={{ textDecoration: "none" }}>
    <div className="hover" style={{ width: "100%", padding: "1em 1.5em", display: "flex" }}>
      <img src={image || USER_PLACEHOLDER} alt="User" style={{ height: "2.5em", width: "2.5em", borderRadius: "50%", marginRight: "0.9em", verticalAlign: "middle" }}/>
      <div style={{ flexGrow: "1", verticalAlign: "middle", overflow: "hidden" }}>
        <p className="ellipsis" style={{ color: darkBlack, fontSize: "1em" }}>{name || "Deleted User" }</p>
        <p style={{ color: lightBlack, fontSize: "0.8em" }}>{location || "Unknown Location"}</p>
      </div>
    </div>
  </Link>;
}

AttendeesListItem.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  location: PropTypes.string,
  userId: PropTypes.string,
};