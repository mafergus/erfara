import React from 'react';
import PropTypes from 'prop-types';

import FullscreenDialogFrame from './FullscreenDialogFrame';

const getStyles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default function FullscreenDialog (props, { muiTheme }) {
  const styles = getStyles(props, muiTheme);

  const {
    children,
    open,
    style,
  } = props;

  return (
    <FullscreenDialogFrame
      open={open}
      style={{ ...style, ...styles.root }}
    >
      {children}
    </FullscreenDialogFrame>
  );
}

FullscreenDialog.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  style: PropTypes.object,
};

FullscreenDialog.defaultProps = {
  children: null,
  open: false,
  style: {},
};

FullscreenDialog.contextTypes = {
  muiTheme: PropTypes.object
};