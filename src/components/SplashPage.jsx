import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Share from 'material-ui/svg-icons/notification/wc';
import Learn from 'material-ui/svg-icons/social/sentiment-very-satisfied';
import Experience from 'material-ui/svg-icons/image/brightness-7';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';
import typography from 'material-ui/styles/typography';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { cyan500, darkWhite, orange50, lightBlack, darkBlack } from 'material-ui/styles/colors';
import AuthModal from 'components/auth/AuthModal';
import HomeFeature from 'components/HomeFeature';
import FullWidthSection from 'components/FullWidthSection';
import EventsList from "components/EventList/EventList";

function mapStateToProps(state, props) {
  return {
    authedUser: state.authedUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export class SplashPage extends React.Component {

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
      isJoinOpen: false,
    }
  }

  renderHero() {
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
            Life is about the people you meet, and the experiences you share
          </h2>
          <RaisedButton
            className="demo-button"
            style={{marginTop: '100px'}}
            primary={true}
            label="Join"
            onTouchTap={() => this.setState({ isJoinOpen: true })}
            buttonStyle={{width: '10em'}}
          />
          <AuthModal
            title="Sign Up"
            isOpen={this.state.isJoinOpen}
            handleClose={() => this.setState({ isJoinOpen: false })}
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

  renderJoinModal() {
    return <Dialog
      contentStyle={{textAlign: "center", width: "40%", marginBottom: "300px"}}
      title="Sign Up"
      titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: lightBlack }}
      modal={false}
      onRequestClose={() => this.setState({ isJoinOpen: false })}
      open={this.state.isJoinOpen}>
      <button
        style={{margin: "3em 8em 3em 0em", verticalAlign: "middle"}}
        className="googleSignUpButton"
        onClick={this.handleSignUpGoogle} />
      <button
        style={{verticalAlign: "middle"}}
        className="facebookSignUpButton"
        onClick={this.handleSignUpFacebook} />
    </Dialog>
  }

  renderDescriptionItem(image, text) {
    return <div style={{ display: "inline-block", margin: "0px 20px", verticalAlign: "text-top" }}>
      <div style={{ textAlign: "center" }}>{image}</div>
      <h4 style={{ width: "200px", textAlign: "center", fontWeight: "200", fontSize: "0.8em", color: darkBlack }}>{text}</h4>
    </div>;
  }

  renderDescription() {
    const style = {
      color: lightBlack,
      height: "36px",
      width: "36px",
    }
    return <div style={{ width: "100%", backgroundColor: orange50, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {this.renderDescriptionItem(<Learn style={style} />, "Learn interesting skills from thousands of passionate individuals")}
      {this.renderDescriptionItem(<Share style={style} />, "Share a unique skill or ability with others")}
      {this.renderDescriptionItem(<Experience style={style} />, "Build amazing friendships with people in your community")}
    </div>
  }

  render() {
    const { authedUser } = this.props;
    const isAuthed = authedUser && Object.keys(authedUser).length > 0;

    return <div style={{ position: "absolute", top: 63, bottom: 0, left: 0, width: "100%" }}>
      <div style={{ width: "43%", height: "100%", display: "inline-block" }}>
        <div style={{ height: "80%", width: "100%", padding: 80 }} className="heroImage">
          <div>
            <span style={{ fontSize: "2em", color: "#424242" }}>Share knowledge,<br/>build friendships.</span>
          </div>
        </div>
        <div style={{ height: "20%", width: "100%", backgroundColor: orange50, overflow: "hidden" }}>
          {!isAuthed && this.renderDescription()}
        </div>
      </div>
      <div style={{ width: "57%", height: "100%", display: "inline-block", overflowX: "hidden" }}>
        <EventsList style={{ width: "720px" }} />
      </div>
    </div>;
  }

  // render() {
  //   const style = {
  //     paddingTop: spacing.desktopKeylineIncrement,
  //   };
  //   const { authedUser } = this.props;
  //   const isAuthed = authedUser && Object.keys(authedUser).length > 0;
  //   const list = this.state.showEvents ? <EventsList /> : this.renderFeatures();

  //   return (
  //     <div style={style}>
  //       {this.renderJoinModal()}
  //       {!isAuthed && this.renderHero()}
  //       <div style={{ float: "right", marginTop: "1em", marginRight: "1em" }}>
  //         <FlatButton label="Events" style={{ marginRight: "1em" }} onTouchTap={ () => this.setState({ showEvents: true }) } />
  //         <FlatButton label="Categories" onTouchTap={ () => this.setState({ showEvents: false }) }/>
  //       </div>
  //       <span style={{ float: "clear" }} />
  //       <a style={{ width: "100%", textAlign: "center", fontSize: "1.3em", color: lightBlack, fontWeight: "bold", lineHeight: "3em" }}>Check out some events near you:</a>
  //       {list}
  //       {!isAuthed && this.renderDescription()}
  //     </div>
  //   );
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(SplashPage));
