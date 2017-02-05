import React, { PropTypes } from "react";
import autoBind from "react-autobind"
import { connect } from "react-redux";
import { Link } from "react-router";
import { GridTile } from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconButton from 'material-ui/IconButton';
import { addEventPhoto } from "../actions/eventActions";
import store from "../store/store";

function mapStateToProps(state, props) {
  return {
    event: state.events.get(props.eventUid),
    photoURL: event && event.photoURL,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
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
    if (this.props.event) {
      this.fetchPhoto();
    }
  }

  fetchPhoto() {
    const id = this.props.event.photo.split(/:(.+)/)[1];
    store.dispatch(addEventPhoto(this.props.eventUid, id));
  }

	render() {
    const { event, eventUid, photoURL } = this.props;
		return <Link to={`/event/${eventUid}`}>
      <GridTile
        key={eventUid}
        title={event.title}
        subtitle={<span>by <b>{event.description}</b></span>}
        actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
      >
        <img src={photoURL} />
      </GridTile>
     </Link>;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListItem);