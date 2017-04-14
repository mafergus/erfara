import React, { PropTypes } from "react";
import ErfaraIcon from 'components/ErfaraIcon';
import { lightTwo } from "utils/colors";

const ITEM_STYLE = {
  position: "relative",
  height: 124,
  width: 137,
  marginRight: 22,
  marginBottom: 19,
  borderRadius: "3%",
  display: "inline-block",
  backgroundPosition: "50% 50%",
  backgroundSize: "cover",
};

const OVERLAY_STYLE = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  "alignItems": "center",
  "justifyContent": "center",
};

export default function CategoryListItem({ style, category, onClick, isSelected }) {
  return <div
    onClick={onClick.bind(null, category)}
    className="hover-opacity"
    style={{ 
      ...ITEM_STYLE,
      ...style,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('${category.image}')`
    }}
  >
    <h4 style={{ color: isSelected ? lightTwo : "white", margin: 0, fontWeight: "600", position: "absolute", bottom: 10, left: 10 }}>
      {category.name}
    </h4>
    {isSelected && <div style={OVERLAY_STYLE}>
      <ErfaraIcon color="white" style={{ height: 42, width: 42 }}/>
    </div>}
  </div>;
}

CategoryListItem.propTypes = {
  category: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
};