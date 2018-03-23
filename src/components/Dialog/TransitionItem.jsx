import React from 'react';
import PropTypes from 'prop-types';


export default class TransitionItem extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
  };

  static defaultProps = {
    children: null,
    style: {},
  };

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