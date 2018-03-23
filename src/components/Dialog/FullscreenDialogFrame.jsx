import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import AutoLockScrolling from 'material-ui/internal/AutoLockScrolling';
import TransitionItem from 'components/Dialog/TransitionItem';

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    zIndex: 1500,
    background: '#fafafa',
  }
};

export default function FullscreenDialogFrame ({ children, open, style }) {
  return (
    <TransitionGroup
      component='div'
    >
      {open && <TransitionItem style={{
          ...styles.root,
          ...style,
        }}
        >
          {children}
        </TransitionItem>
      }
      <AutoLockScrolling lock={open} />
    </TransitionGroup>
  );
}

FullscreenDialogFrame.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

FullscreenDialogFrame.defaultProps = {
  children: null,
  style: {},
};
