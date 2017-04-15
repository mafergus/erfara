import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Title from 'react-title-component';
import 'babel-polyfill';
import ContentAdd from 'material-ui/svg-icons/content/add';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { orange500, orange700 } from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import withWidth from 'material-ui/utils/withWidth';
import AppBar from "components/AppBar";
import CreateEventModal from "components/Modals/CreateEventModal";

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

  renderContent() {
    const { children } = this.props;

    return children;
  }

  render() {
    const unreadMessages = this.props.unreadMessages && this.props.unreadMessages > 0 ? 
      `(${this.props.unreadMessages}) Erfara` : 
      "Erfara";

    return (
      <div>
        <Title render={unreadMessages} />
        <AppBar onEventCreate={() => this.setState({ eventModalOpen: true })} />
        <div style={{ position: "absolute", top: 63, bottom: 0, left: 0, width: "100%" }}>
          {this.renderContent()}
        </div>
        {this.renderFAB()}
        <CreateEventModal isOpen={this.state.eventModalOpen} onRequestClose={() => this.setState({ eventModalOpen: false })} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withWidth()(App));
