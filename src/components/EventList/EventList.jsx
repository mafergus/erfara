import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { getEvents } from "actions/eventActions";
import { getUsers } from "actions/userActions";
import EventListItem from "components/EventList/EventListItem";
import { Row } from "react-bootstrap";

function orderByDate(arr) {
  return arr.slice().sort(function (a, b) {
    return a[1]["date"] < b[1]["date"] ? -1 : 1;
  });
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
    events: PropTypes.array,
    header: PropTypes.node,
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

  renderFeaturedItem(rows, item) {
    const { muiTheme, itemStyle } = this.props;
    let items = [];
    items.push(<EventListItem
      itemStyle={itemStyle}
      muiTheme={muiTheme}
      key={item[0]}
      eventUid={item[0]}
      event={item[1]}
      isFeatured
    />);
    return this.renderRow(rows, items);
  }

  renderRow(rows, items) {
    return <Row key={rows.length}>{items}</Row>;
  }

  render() {
    const { cols, events, style, hasFeatured, muiTheme, itemStyle, header } = this.props;
    const STYLE = {
      padding: "0px 15px",
      position: "relative",
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 1100,
      ...style,
    }
    const rows = [];
    let items = [];
    events.forEach(item => {
      if (hasFeatured && rows.length === 0) {
        rows.push(this.renderFeaturedItem(rows, item));
        return;
      }
      if (items.length === cols) {
        rows.push(this.renderRow(rows, items));
        items = [];
      }
      items.push(
        <EventListItem
          itemStyle={itemStyle}
          muiTheme={muiTheme}
          key={item[0]}
          eventUid={item[0]}
          event={item[1]} 
        />
      );
    });
    if (items.length !== 0) { rows.push(this.renderRow(rows, items)) }
    return <div style={STYLE}>
      <div style={{ width: "100%", margin: "0px auto 20px auto" }}>{header}</div>
      {rows}
    </div>;
  }
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(EventsList));