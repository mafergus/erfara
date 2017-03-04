import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import firebase from 'actions/database';
import store from "store/store";
import { lightBlack } from 'material-ui/styles/colors';

export default class LoggedInUserComponent extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    image: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      open: false,
    };
  }

  mouseOver() {
    this.setState({ open: true });
  }
    
  mouseOut() {
    this.setState({ open: false });
  }

  onClick(event) {
      // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  onSignOut() {
    this.context.router.push('/');
    firebase.auth().signOut().then(function() {
      store.dispatch({ type: "SIGN_OUT_USER" });
    }, function() {
      alert("oops");
    });
    const emptyUser = {};
    localStorage.setItem("authedUser", JSON.stringify(emptyUser));
  }

  render() {
    const { name, image } = this.props;
    return <div className="actionBarUser" style={{ height: "100%", marginTop: "-8px", marginLeft: "1.4em", borderRadius: "3%", display: "inline-block" }}>
      <div onTouchTap={this.onClick} style={{ height: "100%", display: "flex", alignItems: "center", marginRight: "1em" }}>
        <img src={image} alt="You" style={{ height: "1.7em", width: "1.7em", borderRadius: "50%", margin: "0 auto" }} />
        <a style={{ color: lightBlack, display: "inline-block", fontSize: "1em", marginLeft: "0.5em" }}>{name}</a>
      </div>
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        onRequestClose={this.handleRequestClose}
      >
        <Menu>
          <MenuItem primaryText="Sign out" onClick={this.onSignOut} />
        </Menu>
      </Popover>
    </div>;
  }
}