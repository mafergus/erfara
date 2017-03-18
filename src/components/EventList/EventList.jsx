import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { getEvents } from "actions/eventActions";
import { getUsers } from "actions/userActions";
import EventListItem from "components/EventList/EventListItem";
import Row from "components/GridList/Row";

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

  render() {
    const { cols, events, style, hasFeatured, colPadding, rowPadding, muiTheme, itemStyle, header } = this.props;
    const STYLE = {
      width: 720,
      paddingTop: 0,
      position: "relative",
      marginLeft: "auto",
      marginRight: "auto",
      ...style,
    }
    const rows = [];
    let items = [];
    let processedFeatured = false;
    events.forEach(item => {
      if (hasFeatured && !processedFeatured) {
        rows.push(<Row key={rows.length} rowPadding={rowPadding}>
            [<EventListItem
              itemStyle={itemStyle}
              muiTheme={muiTheme}
              key={item[0]}
              eventUid={item[0]}
              event={item[1]}
              isFeatured
            />]
          </Row>);
        processedFeatured = true;
        return;
      }
      if (items.length === cols) {
        rows.push(<Row key={rows.length}>{items}</Row>);
        items = [];
      }
      items.push(<EventListItem itemStyle={itemStyle} muiTheme={muiTheme} key={item[0]} eventUid={item[0]} event={item[1]} />);
    });
    if (items.length !== 0) { rows.push(<Row key={rows.length} colPadding={colPadding} rowPadding={rowPadding}>{items}</Row>) }
    return <div style={STYLE}>
      <div style={{ width: 1150, margin: "0px auto 20px auto" }}>{header}</div>
      {rows}
    </div>;
  }
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(EventsList));