import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { getEvents } from "actions/eventActions";
import { fetchUsers } from "utils/Api";
import { addUsers } from "actions/userActions";

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getEvents, addUsers }, dispatch);
}

export class EventsList extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    getEvents: PropTypes.func.isRequired,
    addUsers: PropTypes.func.isRequired,
    style: PropTypes.object,
    header: PropTypes.node,
  };

  static defaultProps = {
    children: {},
    style: {},
    header: null,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { getEvents, addUsers } = this.props; 
    getEvents();
    fetchUsers().then(snap => {
      const users = snap.val();
      if (users) {
        addUsers(users);
      }
    });
  }

  render() {
    const { children, style, header } = this.props;
    const STYLE = {
      padding: "0px 15px",
      position: "relative",
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 1100,
      ...style,
    };
    return <div style={STYLE}>
      <div style={{ width: "100%", margin: "0px auto 20px auto" }}>{header}</div>
      {children}
    </div>;
  }
}

export default connect(null, mapDispatchToProps)(EventsList);