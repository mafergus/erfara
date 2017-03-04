import React, { PropTypes } from "react";

export default function Hero({ children, image }) {
  const STYLE = {
    position: "relative",
    height: "250px",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${image}')`,
    backgroundSize: "cover",
    backgroundPosition: "50% 40%",
    /*background-blend-mode: multiply;*/
    /*background-color: #F39C11;*/
    objectFit: "cover",
  };
  return <div style={ STYLE }>
    {children}
  </div>;
}

Hero.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
};