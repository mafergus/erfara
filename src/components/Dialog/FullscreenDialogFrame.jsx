import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import AutoLockScrolling from 'material-ui/internal/AutoLockScrolling';

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

class TransitionItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      style: {
        opacity: 0,
        transition: 'all 225ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        transform: 'translate(0, 56px)',
      }
    };
  }

  componentWillUnmount () {
    clearTimeout(this.enterTimeout);
    clearTimeout(this.leaveTimeout);
  }

  componentWillEnter (callback) {
    this.componentWillAppear(callback);
  }

  componentWillAppear (callback) {
    this.enterTimeout = setTimeout(() => {
      this.setState({
        style: {
          opacity: 1,
          transition: 'all 225ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          transform: 'translate(0, 0px)',
        }
      });
      this.enterTimeout = setTimeout(callback, 225); // matches transition duration
    });
  }

  componentWillLeave (callback) {
    this.setState({
      style: {
        opacity: 0,
        transition: 'all 195ms cubic-bezier(0.4, 0.0, 1, 1)',
        transform: 'translate(0, 56px)',
      }
    });

    this.leaveTimeout = setTimeout(callback, 195); // matches transition duration
  }

  render () {
    const {
      style,
      children,
      ...other
    } = this.props;

    return (
      <div {...other} style={{ ...style, ...this.state.style }}>
        {children}
      </div>
    );
  }
}

TransitionItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

TransitionItem.defaultProps = {
  children: null,
  style: {},
};

export default function FullscreenDialogFrame ({ children, open, style }) {
  return (
    <TransitionGroup
      component='div'
      transitionAppear
      transitionAppearTimeout={225}
      transitionEnter
      transitionEnterTimeout={225}
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
