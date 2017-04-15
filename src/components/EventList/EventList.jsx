import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from 'react-redux';
import { getEvents } from "actions/eventActions";
import { getUsers } from "actions/userActions";
import EventListItem from "components/EventList/EventListItem";
import { Row } from "react-bootstrap";

function orderByDate(arr) {
  return arr.slice().sort((a, b) => a[1]["date"] < b[1]["date"] ? -1 : 1);
}

function mapStateToProps(state) {
  const sortedEvents = orderByDate(Object.entries(state.events.toJS()));
  return {
    events: sortedEvents,
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
    getEvents: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    style: PropTypes.object,
    itemStyle: PropTypes.object,
    events: PropTypes.array.isRequired,
    header: PropTypes.node,
    hasFeatured: PropTypes.bool,
    cols: PropTypes.number,
  };

  static defaultProps = {
    style: {},
    itemStyle: {},
    hasFeatured: true,
    cols: 2,
    header: null,
  };

  static renderRow(rows, items) {
    return <Row key={rows.length}>{items}</Row>;
  }
  
  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    this.props.getEvents();
    this.props.getUsers();
  }

  renderFeaturedItem(rows, item) {
    const { itemStyle } = this.props;
    const items = [];
    items.push(<EventListItem
      itemStyle={itemStyle}
      key={item[0]}
      eventUid={item[0]}
      event={item[1]}
      isFeatured
    />);
    return EventList.renderRow(rows, items);
  }

  render() {
    const { cols, events, style, hasFeatured, itemStyle, header } = this.props;
    const STYLE = {
      padding: "0px 15px",
      position: "relative",
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 1100,
      ...style,
    };
    const rows = [];
    let items = [];
    events.forEach(item => {
      if (hasFeatured && rows.length === 0) {
        rows.push(this.renderFeaturedItem(rows, item));
        return;
      }
      if (items.length === cols) {
        rows.push(EventList.renderRow(rows, items));
        items = [];
      }
      items.push(
        <EventListItem
          itemStyle={itemStyle}
          key={item[0]}
          eventUid={item[0]}
          event={item[1]} 
        />
      );
    });
    if (items.length !== 0) { rows.push(EventList.renderRow(rows, items)); }
    return <div style={STYLE}>
      <div style={{ width: "100%", margin: "0px auto 20px auto" }}>{header}</div>
      {rows}
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);