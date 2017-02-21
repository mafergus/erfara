import React, { PropTypes } from "react";
import autoBind from "react-autobind"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { GridTile } from 'material-ui/GridList';
import Face from 'material-ui/svg-icons/action/face';
import IconButton from 'material-ui/IconButton';
import { white } from "material-ui/styles/colors";
import { getUser } from "../actions/userActions";

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

export class EventListItem extends React.Component {

  static PropTypes = {
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
  };

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
        style={{ minWidth: 200 }}
        title={event.title}
        subtitle={user && <div><img src={user.photo} alt="Creator image" style={{ width: "20px", height: "20px", borderRadius: "50%" }}/>{user.name}</div>}
        actionIcon={<IconButton><span style={{ color: white, fontSize: "2em" }}>3</span><Face color="white" /></IconButton>}
      >
        <img src={event.photo} alt="Event image" />
      </GridTile>
     </Link>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListItem);