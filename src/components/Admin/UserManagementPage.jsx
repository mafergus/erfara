import React, { PropTypes } from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { getUsers } from "actions/userActions";
import { bindActionCreators } from "redux";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import { deleteUser } from "utils/Api";

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUsers }, dispatch);
}

export class UserManagementPage extends React.Component {

  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    users: ImmutablePropTypes.map.isRequired,
  }

  constructor() {
    super();
    autoBind(this);

    this.state = {
      dialogOpen: false,
    };
  }

  componentWillMount() {
    const { getUsers } = this.props;
    getUsers();
  }

  renderRow() {

  }

  renderUser(user) {
    const STYLE = {
      height: 200,
      width: 200,
      display: "inline-block",
      backgroundImage: `url(${user.photo})`,
      backgroundPosition: "50% 50%",
      backgroundSize: "cover",
      backgroundBlendMode: "multiply",
      backgroundColor: "rgba(0,0,0,0.35)",
      margin: 15,
    };
    return <div style={STYLE} className="hoverable" onClick={() => this.setState({ dialogOpen: true, selectedUser: user.uid })}>
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>{user.name}</span>
      </div>
    </div>;
  }

  render() {
    const { users } = this.props;
    return <div>
      <Dialog
        modal={false}
        onRequestClose={() => this.setState({ dialogOpen: false, })}
        open={this.state.dialogOpen}>
        <RaisedButton
          label="Delete User"
          onClick={deleteUser.bind(null, this.state.selectedUser)}
          primary
        />
      </Dialog>;
      {users.map(user => this.renderUser(user))}
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementPage);