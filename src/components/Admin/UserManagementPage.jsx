import React from "react";
import PropTypes from 'prop-types';
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { addUsers } from "actions/userActions";
import { fetchUsers } from "utils/Api";
import { bindActionCreators } from "redux";
import Dialog from "material-ui/Dialog";
import UserDetails from "components/Admin/UserDetails";

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addUsers }, dispatch);
}

export class UserManagementPage extends React.Component {

  static propTypes = {
    addUsers: PropTypes.func.isRequired,
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
    const { addUsers } = this.props;
    fetchUsers().then(snap => {
      const users = snap.val();
      if (users) {
        addUsers(users);
      }
    });
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

    return <div
      style={STYLE}
      className="hoverable"
      onClick={() => this.setState({ dialogOpen: true, selectedUser: user })}
    >
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>{user.name}</span>
      </div>
    </div>;
  }

  render() {
    const { users } = this.props;
    const { selectedUser } = this.state;
    const userComponents = users.valueSeq().map(entry => {
      return this.renderUser(entry);
    });

    return <div>
      <Dialog
        modal={false}
        onRequestClose={() => this.setState({ dialogOpen: false, })}
        open={this.state.dialogOpen}>

        <UserDetails
          user={selectedUser}
          onClose={() => this.setState({ dialogOpen: false })}
        />
      </Dialog>;
      {userComponents}
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementPage);