import React from "react";
import PropTypes from 'prop-types';
import { erfaraBlack } from "utils/colors";

const IMG_STYLE = {
  height: 35,
  width: 35,
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: 20,
};

export default function HorizontalEventAttendees({ attendees }) {
  return <div className="light-shadow border" style={{ backgroundColor: "white", padding: 17, marginBottom: 14 }}>
     <div style={{ height: "100%", width: "100%" }}>
      <span style={{ color: erfaraBlack, fontSize: "1em" }}>{attendees.length} going</span>
      <hr style={{ margin: "17px 0px" }} />
    </div>
    <div>
      {attendees.map(user => user && <img 
        alt="Attendee"
        key={user.uid}
        style={IMG_STYLE}
        src={user.photo} />)
      }
    </div>
  </div>;
}

HorizontalEventAttendees.propTypes = {
  attendees: PropTypes.array.isRequired,
};