import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Title from 'react-title-component';
import IconButton from 'material-ui/IconButton';
import spacing from 'material-ui/styles/spacing';
import ContentAdd from 'material-ui/svg-icons/content/add';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { darkWhite, lightWhite, grey900, orange500, orange700 } from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import withWidth, { MEDIUM, LARGE } from 'material-ui/utils/withWidth';
import FullWidthSection from "components/FullWidthSection";
import AppBar from "components/AppBar";
import CreateEventModal from "components/Modals/CreateEventModal";
import { getUnreadMessageCount } from "utils/helpers";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
    unreadMessages: getUnreadMessageCount(state),
  };
}

class App extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    unreadMessages: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    muiTheme: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      eventModalOpen: false,
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  componentWillMount() {
    this.setState({
      muiTheme: getMuiTheme({
        palette: {
            primary1Color: orange500,
            primary2Color: orange700,
        },
      }),
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme,
    });
  }

  getStyles() {
    const styles = {
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: 356,
      },
      browserstack: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: '25px 15px 0',
        padding: 0,
        color: lightWhite,
        lineHeight: '25px',
        fontSize: 12,
      },
      browserstackLogo: {
        margin: '0 3px',
      },
      iconButton: {
        color: darkWhite,
      },
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  }

  handleChangeMuiTheme = (muiTheme) => {
    this.setState({
      muiTheme: muiTheme,
    });
  };

  renderFooter() {
    const { prepareStyles } = this.state.muiTheme;
    const hideFooter = this.context.router.isActive('/messages');
    const styles = this.getStyles();
    return !hideFooter && <FullWidthSection style={styles.footer}>
      <p style={prepareStyles(styles.p)}>
        Brought to you by the fine folks at PhoenixApp
      </p>
      <IconButton
        iconStyle={styles.iconButton}
        iconClassName="muidocs-icon-custom-github"
        href="https://github.com/callemall/material-ui"
      />
      <p style={prepareStyles(styles.browserstack)}>
        Thank you for joining our community! Give us your feedback!
      </p>
    </FullWidthSection>;
  }

  renderFAB() {
    const hideFab = this.context.router.isActive('/messages');
    return !hideFab && 
      <FloatingActionButton
        onTouchTap={() => this.setState({ eventModalOpen: true })}
        style={{ position: "fixed", right: "1.3em", bottom: "1.3em" }}
      >
        <ContentAdd />
      </FloatingActionButton>;
  }

  renderContent() {
    const styles = this.getStyles();
    const router = this.context.router;
    const title =
      router.isActive('/get-started') ? 'Get Started' :
      router.isActive('/customization') ? 'Customization' :
      router.isActive('/components') ? 'Components' :
      router.isActive('/discover-more') ? 'Discover More' : '';
    const { prepareStyles } = this.state.muiTheme;
    const { children } = this.props;

    return title !== '' ?
      <div style={prepareStyles(styles.root)}>
        <div style={prepareStyles(styles.content)}>
          {React.cloneElement(children, {
            onChangeMuiTheme: this.handleChangeMuiTheme,
          })}
        </div>
      </div> :
      children
  }

  render() {
    const styles = this.getStyles();
    const router = this.context.router;
    const title =
      router.isActive('/get-started') ? 'Get Started' :
      router.isActive('/customization') ? 'Customization' :
      router.isActive('/components') ? 'Components' :
      router.isActive('/discover-more') ? 'Discover More' : '';
    if (this.props.width === LARGE && title !== '') {
      styles.root.paddingLeft = 256;
      styles.footer.paddingLeft = 256;
    }

    const unreadMessages = this.props.unreadMessages && this.props.unreadMessages > 0 ? 
      `(${this.props.unreadMessages}) Erfara` : 
      "Erfara";

    return (
      <div>
        <Title render={unreadMessages} />
        <AppBar />
        {this.renderContent()}
        {this.renderFAB()}
        <CreateEventModal isOpen={this.state.eventModalOpen} onRequestClose={ () => this.setState({ eventModalOpen: false }) }/>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withWidth()(App));
