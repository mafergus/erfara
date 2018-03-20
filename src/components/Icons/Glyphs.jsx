import React from 'react';
import PropTypes from 'prop-types';

/**
 * Alarm Off - Bell with diagonal strike-through
 * @param {Object} props properties
 * @return {ReactElement} Icon
 */
export function AlarmOff({ off, ...otherProps }) {
  return <g {...otherProps} fill="none">
    <path d="M24.2 13.5a10 10 0 1 0-20 0c0 4.6-.8 6-2.2 6.3a2 2 0 0 0-1.6 2V25h27v-3.3A2 2 0 0 0 26 20c-1.2-.5-1.8-2-1.8-6.5zM18 25.7c0 2-1.6 3-3.5 3s-3.5-1-3.5-3M12 3a2.4 2.4 0 1 1 4.6 0"/>
    {off && <path d="M36 3.5L2.8 38"/>}
  </g>;
}

AlarmOff.propTypes = {
  off: PropTypes.bool,
};

export function Place(props) {
  return <svg width="42" height="60" viewBox="0 0 42 60" {...props}>
    <path d="M21 0C9.36 0 0 9.4 0 21c0 15.74 21 39 21 39s21-23.25 21-39A21 21 0 0 0 21 0zm0 28.5a7.51 7.51 0 1 1 0-15.03 7.51 7.51 0 0 1 0 15.02z" fill={props.color} fillRule="nonzero"/>
  </svg>;
}