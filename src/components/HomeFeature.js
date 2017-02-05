import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import spacing from 'material-ui/styles/spacing';
import transitions from 'material-ui/styles/transitions';
import typography from 'material-ui/styles/typography';
import {grey200} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

class HomeFeature extends Component {

  static propTypes = {
    firstChild: PropTypes.bool,
    heading: PropTypes.string,
    imageClass: PropTypes.string,
    lastChild: PropTypes.bool,
    route: PropTypes.string,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    firstChild: false,
    lastChild: false,
  };

  state = {
    zDepth: 0,
  };

  getStyles() {
    const desktopGutter = spacing.desktopGutter;
    const desktopKeylineIncrement = spacing.desktopKeylineIncrement;
    const styles = {
      root: {
        transition: transitions.easeOut(),
        maxWidth: '300px',
        margin: `0 auto ${desktopGutter}px auto`,
      },
      rootWhenMedium: {
        float: 'left',
        width: '33%',
        marginRight: 4,
        marginBottom: 0,
      },
      image: {
        // Not sure why this is needed but it fixes a display issue in chrome
        marginBottom: -6,
      },
      heading: {
        fontSize: 20,
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
        fontWeight: typography.fontWeightMedium,
        color: typography.textDarkBlack,
        backgroundColor: grey200,
        textAlign: 'center',
        margin: 0,
        padding: 0,
        lineHeight: `${desktopKeylineIncrement}px`,
      },
      rootWhenLastChild: {
        marginBottom: 0,
      },
      rootWhenMediumAndLastChild: {
        marginRight: 0,
        marginBottom: 0,
      },
      rootWhenMediumAndFirstChild: {
        marginLeft: 0,
      },
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.root = Object.assign(
        styles.root,
        styles.rootWhenMedium,
        this.props.firstChild && styles.rootWhenMediumAndFirstChild,
        this.props.lastChild && styles.rootWhenMediumAndLastChild
      );
    }

    return styles;
  }

  handleMouseEnter = () => {
    this.setState({
      zDepth: 4,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      zDepth: 0,
    });
  };

  render() {
    const styles = this.getStyles();

    return (
      <Paper
        zDepth={this.state.zDepth}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={Object.assign(
          styles.root,
          this.props.lastChild && styles.rootWhenLastChild
        )}
      >
        <h3 style={styles.heading}>{this.props.heading}</h3>
        <Link to={this.props.route}>
          <img style={styles.image} className={this.props.imageClass} />
        </Link>
      </Paper>
    );
  }
}

export default withWidth()(HomeFeature);
