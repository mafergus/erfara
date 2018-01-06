import React from "react";
import PropTypes from 'prop-types';
import { Col } from "react-bootstrap";

const ITEM_STYLE = {
  position: "relative",
  height: 160,
  marginBottom: 19,
  display: "inline-block",
};

const CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "2%",
  backgroundPosition: "50% 50%",
  backgroundSize: "cover",
};

export default function UserCategoryItem({ categoryImage, categoryName, onClick, userImage, username, style }) {
  return <Col
    onClick={() => onClick()}
    className="hover-opacity"
    style={{ ...ITEM_STYLE, ...style }}
    xs={5}
    md={4}
    lg={3}
  >
    <div style={{ ...CONTAINER_STYLE,
      backgroundImage: `linear-gradient(to bottom right, rgba(255, 152, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${categoryImage}')` }}
    >
      <h2 style={{ color: "white", minHeight: 70, marginTop: 30, padding: "0px 30px", textAlign: "center" }}>{categoryName}</h2>
      <span>
        <img src={userImage} style={{ display: "inline-block", borderRadius: "50%", width: 35, height: 35, marginRight: 10 }} />
        <h4 style={{ color: "white", display: "inline-block" }}>{username}</h4>
      </span>
    </div>
  </Col>;
}

UserCategoryItem.propTypes = {
  categoryImage: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  userImage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  style: PropTypes.object,
};

UserCategoryItem.defaultProps = {
  style: {},
};