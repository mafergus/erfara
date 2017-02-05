import React, { PropTypes } from "react";
import Immutable from "immutable";
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import { connect } from 'react-redux';
import { getEvents } from "../actions/eventActions";
import { GridList } from 'material-ui/GridList';
import EventCard from "./EventCard";
import Subheader from 'material-ui/Subheader';
import { getUsers } from "../actions/userActions";
import EventListItem from "./EventListItem";

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
          <EventListItem eventUid={key} event={value} />
        ))}
      </GridList>
  </div>;
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);