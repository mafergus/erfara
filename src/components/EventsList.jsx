import React, { PropTypes } from "react";
import Immutable from "immutable";
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import { connect } from 'react-redux';
import { getEvents } from "../actions/eventActions";
import { GridList, GridTile } from 'material-ui/GridList';
import EventCard from "./EventCard";
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { Link } from "react-router";
import { getUsers } from "../actions/userActions";

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    marginTop: "1em",
    width: "70%",
    height: 450,
    overflowY: 'auto',
  },
};

function mapStateToProps(state) {
  return {
    events: state.events,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEvents: () => dispatch(getEvents()),
    getUsers: () => dispatch(getUsers()),
  };
}

export class EventsList extends React.Component {

  static propTypes = {
    events: ImmutablePropTypes.map.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    this.props.getEvents();
    this.props.getUsers();
  }

  render() {
    const { events } = this.props;
    if (!events) {
      return <div>LOADING</div>;
    }

    return <div style={styles.root}>
      <GridList
        cols={3}
        padding={35}
        cellHeight={250}
        style={styles.gridList}
      >
        {events && events.map((value, key) => (
          <Link to={`/event/${key}`}>
          <GridTile
            key={value.photo}
            title={value.title}
            subtitle={<span>by <b>{value.description}</b></span>}
            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
          >
            <img src={value.photo || "http://www.tuscanysportholidays.com/media/k2/items/cache/1c0ae2205709722b62e843abc0471a55_XL.jpg"} />
          </GridTile>
          </Link>
        ))}
      </GridList>
  </div>;
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);