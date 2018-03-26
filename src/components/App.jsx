import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import DocumentTitle from 'react-document-title';
import 'babel-polyfill';
import ContentAdd from 'material-ui/svg-icons/content/add';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { orange500, orange700 } from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AppBar from "components/AppBar";
import CreateEventModal from "components/Modals/CreateEventModal";
import OnboardingModal from "components/Onboarding/OnboardingModal";
import { FB_APP_ID } from "utils/constants";

function mapStateToProps(state) {
  return {
    authedUser: state.authedUser,
    unreadMessages: state.conversations.get("unreadMessages"),
  };
}

class App extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    unreadMessages: PropTypes.number.isRequired,
  };

  static defaultProps = {
    children: null,
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

  doSignUp() {
    const { query } = this.props.location;
    const code = query.code;
    const baseUrl = "https://graph.facebook.com/v2.12/oauth/access_token";
    const redirectUrl = "http://localhost:3000/handleAuth";
    const APP_SECRET = "3edd7b2e18d82e13d6956de95f7f27d5";

    const request = async () => {
      const response = await fetch(`${baseUrl}?client_id=${FB_APP_ID}&redirect_uri=${redirectUrl}&client_secret=${APP_SECRET}&code=${code}`);
      const json = await response.json();
      console.log(json);
      const accessToken = json.access_token;
    }

    request();
  }

  componentWillMount() {
    const props = this.props;

    if (this.props.location) {
      this.doSignUp();
    }

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

  handleChangeMuiTheme = (muiTheme) => {
    this.setState({
      muiTheme: muiTheme,
    });
  };

  renderFAB() {
    const hideFab = this.context.router.isActive('/messages');
    return !hideFab && 
      <FloatingActionButton
        className="fab"
        onTouchTap={() => this.setState({ eventModalOpen: true })}
        style={{ position: "fixed", right: 8, bottom: 8 }}
      >
        <ContentAdd />
      </FloatingActionButton>;
  }

  render() {
    const { children, unreadMessages } = this.props;
    const unreadMessagesString = unreadMessages && unreadMessages > 0 ? `(${unreadMessages}) Erfara` : "Erfara";

    return (
      <div>
        <DocumentTitle title={unreadMessagesString}>
          <div>
            <AppBar onEventCreate={() => this.setState({ eventModalOpen: true })} />
            <div style={{ position: "absolute", top: 63, bottom: 0, left: 0, width: "100%" }}>
              {children}
            </div>
            {this.renderFAB()}
            <CreateEventModal
              isOpen={this.state.eventModalOpen}
              onRequestClose={() => this.setState({ eventModalOpen: false })}
            />
            <OnboardingModal />
          </div>
        </DocumentTitle>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
