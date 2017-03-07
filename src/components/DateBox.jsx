import React, { PropTypes } from "react";
import { getShortMonth } from "utils/dateTimeHelpers";
import { erfaraBlack } from "utils/colors";

const STYLE = {
  height: 70,
  width: 70,
  backgroundColor: "white",
  display: "inline-block",
  borderRight: "1px solid rgba(0, 0, 0, 0.06)",
}

export default function DateBox({ style, timestamp, textColor }) {
    return <div style={{ ...style, ...STYLE }}>
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <p style={{ fontSize: "0.8em", fontWeight: "300", color: textColor, textAlign: "center" }}>{getShortMonth(timestamp)}</p>
          <p style={{ fontSize: "1.1em", fontWeight: "200", color: textColor, textAlign: "center" }}>{timestamp.getDate()}</p>
        </div>
      </div>
    </div>;
}

DateBox.defaultProps = {
  textColor: erfaraBlack,
}

DateBox.propTypes = {
  style: PropTypes.object,
  timestamp: PropTypes.string,
  textColor: PropTypes.string,
};