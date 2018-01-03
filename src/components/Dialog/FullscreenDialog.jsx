import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close'

import FullscreenDialogFrame from './FullscreenDialogFrame'

const getStyles = (props, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default function FullscreenDialog (props, { muiTheme }) {
  const styles = getStyles(props, muiTheme)

  const {
    children,
    closeIcon,
    onRequestClose,
    open,
    style,
    title,
    titleStyle,
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
  closeIcon: PropTypes.node,
  onRequestClose: PropTypes.func,
  open: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
};

FullscreenDialog.defaultProps = {
  open: false,
};

FullscreenDialog.contextTypes = {
  muiTheme: PropTypes.object
};