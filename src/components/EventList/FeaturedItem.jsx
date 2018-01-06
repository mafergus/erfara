import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { GridTile } from 'material-ui/GridList';
import Face from 'material-ui/svg-icons/action/face';
import IconButton from 'material-ui/IconButton';
import { white } from "material-ui/styles/colors";
import { getUser } from "actions/userActions";

function mapStateToProps(state, props) {
  const event = state.events.get(props.eventUid);
  return {
    event,
    user: event && state.users.get(event.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class FeaturedItem extends React.Component {

  static propTypes = {
    getUser: PropTypes.func.isRequired,
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  };

  static renderSubtitle(user) {
    return <div>
      <img
        src={user.photo}
        alt="Creator"
        style={{ width: 20, height: 20, borderRadius: "50%" }}
      />
      {user.name}
    </div>;
  }

  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { event, getUser } = this.props;
    if (event) {
      getUser(event.userId);
    }
  }

  render() {
    const { event, eventUid, user } = this.props;
    return <Link to={`/event/${eventUid}`}>
      <GridTile
        key={eventUid}
        style={{ width: 720, height: 250 }}
        title={event.title}
        subtitle={user && FeaturedItem.renderSubtitle(user)}
        actionIcon={<IconButton><span style={{ color: white, fontSize: "2em" }}>3</span><Face color="white" /></IconButton>}
      >
        <img src={event.photo} alt="Event" />
      </GridTile>
     </Link>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedItem);