import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import HomeFeature from './HomeFeature';
import FullWidthSection from './FullWidthSection';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from "material-ui/FlatButton";
import withWidth, {LARGE} from 'material-ui/utils/withWidth';
import spacing from 'material-ui/styles/spacing';
import typography from 'material-ui/styles/typography';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { cyan500, grey200, darkWhite, orange500, lightBlack } from 'material-ui/styles/colors';
import EventsList from "./EventsList";

class HomePage extends React.Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      showEvents: true,
    }
  }

  renderHero  () {
    const styles = {
      root: {
        backgroundColor: cyan500,
        overflow: 'hidden',
        minHeight: '500px',
      },
      svgLogo: {
        marginLeft: window.innerWidth * 0.5 - 130,
        width: 420,
        height: 157,
      },
      tagline: {
        margin: '16px auto 0 auto',
        textAlign: 'center',
        maxWidth: 575,
      },
      label: {
        color: lightBaseTheme.palette.primary1Color,
      },
      githubStyle: {
        margin: '16px 32px 0px 8px',
      },
      h1: {
        fontSize: '1.5em',
        color: darkWhite,
        fontWeight: typography.fontWeightLight,
      },
      h2: {
        fontSize: '1em',
        lineHeight: '28px',
        marginTop: '1.5em',
        marginBottom: '5em',
        letterSpacing: 0,
      },
      nowrap: {
        whiteSpace: 'nowrap',
      },
      taglineWhenLarge: {
        marginTop: 32,
      },
      h1WhenLarge: {
        fontSize: '2em',
      },
      h2WhenLarge: {
        fontSize: '1.5em',
        lineHeight: '32px',
        paddingTop: 16,
        marginBottom: 12,
      },
    };

    styles.h2 = Object.assign({}, styles.h1, styles.h2);

    if (this.props.width === LARGE) {
      styles.tagline = Object.assign({}, styles.tagline, styles.taglineWhenLarge);
      styles.h1 = Object.assign({}, styles.h1, styles.h1WhenLarge);
      styles.h2 = Object.assign({}, styles.h2, styles.h2WhenLarge);
    }

    return (
      <FullWidthSection style={styles.root} className="heroImage">
        <div style={styles.tagline}>
          <h1 style={styles.h1}>Learn. Teach. Experience.</h1>
          <h2 style={styles.h2}>
            Erfara is the world's first community built around sharing skills. You share something you're good at, and in return people share with you
          </h2>
          <RaisedButton
            className="demo-button"
            style={{marginTop: '100px'}}
            primary={true}
            label="Join"
            onTouchTap={this.handleTouchTapDemo}
            buttonStyle={{width: '10em'}}
          />
        </div>
      </FullWidthSection>
    );
  }

  renderFeatures() {
    const styles = {maxWidth: 906};

    return (
      <FullWidthSection useContent={true} contentStyle={styles}>
        <HomeFeature
          heading="Get Started"
          route="/event"
          imageClass="getStartedImage"
          firstChild={true}
        />
        <HomeFeature
          heading="Customization"
          route="/event"
          imageClass="customizationImage"
        />
        <HomeFeature
          heading="Components"
          route="/event"
          imageClass="componentsImage"
          lastChild={true}
        />
      </FullWidthSection>
    );
  }

  handleTouchTapDemo = () => {
    alert("PLEASEEE");
    this.context.router.push('/components');
  };

  componentWillMount() {
  }

  render() {
    const style = {
      paddingTop: spacing.desktopKeylineIncrement,
    };

    const list = this.state.showEvents ? <EventsList /> : this.renderFeatures();

    return (
      <div style={style}>
        {this.renderHero()}
        <div style={{ float: "right", marginTop: "1em", marginRight: "1em" }}>
          <FlatButton label="Events" style={{ marginRight: "1em" }} onTouchTap={ () => this.setState({ showEvents: true }) } />
          <FlatButton label="Categories" onTouchTap={ () => this.setState({ showEvents: false }) }/>
        </div>
        <span style={{ float: "clear" }} />
        <a style={{ width: "100%", textAlign: "center", fontSize: "1.3em", color: lightBlack, fontWeight: "bold", lineHeight: "3em" }}>Check out some events near you:</a>
        {list}
      </div>
    );
  }
}

export default withWidth()(HomePage);
