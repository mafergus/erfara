import React from 'react';
import PropTypes from 'prop-types';

export function Place(props) {
  return <svg width="42" height="60" viewBox="0 0 42 60" {...props}>
    <path d="M21 0C9.36 0 0 9.4 0 21c0 15.74 21 39 21 39s21-23.25 21-39A21 21 0 0 0 21 0zm0 28.5a7.51 7.51 0 1 1 0-15.03 7.51 7.51 0 0 1 0 15.02z" fill={props.color} fillRule="nonzero" />
  </svg>;
}

Place.propTypes = {
  color: PropTypes.any,
};

Place.defaultProps = {
  color: "#ffffff"
};