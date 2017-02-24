import React, { PropTypes } from "react";

export default function Row({ children, colPadding, rowPadding }) {
  return <div style={{ width: "100%", textAlign: "center", paddingBottom: rowPadding }}>
    {children.map((item, index)  => {
        const style = {
          display: "inline-block",
          paddingRight: index === children.length-1 ? 0 : colPadding,
        }
        return <div key={index} style={style}>{item}</div>;
      }
    )}
  </div>;
}

Row.propTypes = {
  children: PropTypes.node,
  colPadding: PropTypes.number,
  rowPadding: PropTypes.number,
}

Row.defaultProps = {
  colPadding: 50,
  rowPadding: 20,
}