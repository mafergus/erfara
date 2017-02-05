import React, { PropTypes } from "react";
import autoBind from "react-autobind"
import { Link } from "react-router";
import { GridTile } from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconButton from 'material-ui/IconButton';

export default class EventListItem extends React.Component {

  static PropTypes = {
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
  };

	constructor() {
		super();
		autoBind(this);
	}

  componentWillMount() {
    this.fetchPhoto();
  }

  fetchPhoto() {
    debugger;
    const id = event.split(/:(.+)/)[1];
    fetch(`https://pixabay.com/api/?key=4423887-ab96e540ffbe404d644032133&id=${id}&pretty=true`).then(function(response) {
      if (response.ok) {
        return response.json();
      }
    }).then(function(json) {
      debugger;
      if (json && json.hits && json.hits.length > 0) {
      }
    }).catch(function(error) {
      console.log("UH OH SHIT FUCKED UP: ", error);
    });
  }

	render() {
    const { event, eventUid } = this.props;
		return <Link to={`/event/${eventUid}`}>
      <GridTile
        key={eventUid}
        title={event.title}
        subtitle={<span>by <b>{event.description}</b></span>}
        actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
      >
        <img src={this.photo || "http://www.tuscanysportholidays.com/media/k2/items/cache/1c0ae2205709722b62e843abc0471a55_XL.jpg"} />
      </GridTile>
     </Link>;
	}
}