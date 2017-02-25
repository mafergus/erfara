import React, { PropTypes } from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import autoBind from "react-autobind";
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { getEvents } from "actions/eventActions";
import { getUsers } from "actions/userActions";
import EventListItem from "components/EventList/EventListItem";
import FeaturedItem from "components/EventList/FeaturedItem";
import GridList from "components/GridList/GridList";
import Row from "components/GridList/Row";

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
    style: PropTypes.object,
    events: ImmutablePropTypes.map.isRequired,
    hasFeatured: PropTypes.bool,
    cols: PropTypes.number,
    colPadding: PropTypes.number,
    rowPadding: PropTypes.number,
    muiTheme: PropTypes.object,
  };

  static defaultProps = {
    hasFeatured: true,
    cols: 2,
    colPadding: 50,
    rowPadding: 20,
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
    const { cols, events, style, hasFeatured, colPadding, rowPadding, muiTheme } = this.props;
    const STYLE = {
      ...style,
      width: "720px",
      paddingTop: 20,
      position: "relative",
      marginLeft: "auto",
      marginRight: "auto",
    }
    const rows = [];
    let items = [];
    let processedFeatured = false;
    events.forEach((item, key) => {
      if (hasFeatured && !processedFeatured) {
        const featured = [];
        featured.push(<EventListItem muiTheme={muiTheme} key={key} eventUid={key} event={item} isFeatured/>);
        rows.push(<Row key={rows.length} rowPadding={rowPadding}>{featured}</Row>);
        processedFeatured = true;
        return;
      }
      if (items.length === cols) {
        rows.push(<Row key={rows.length}>{items}</Row>);
        items = [];
      }
      items.push(<EventListItem muiTheme={muiTheme} key={key} eventUid={key} event={item} />);
    });
    if (items.length !== 0) { rows.push(<Row key={rows.length} rowPadding={rowPadding}>{items}</Row>) }
    return <div style={STYLE}>{rows}</div>;
  }
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(EventsList));