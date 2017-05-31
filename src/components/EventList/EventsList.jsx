import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import EventListItem from "components/EventList/EventListItem";
import { Row } from "react-bootstrap";

export default class EventsList extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    itemStyle: PropTypes.object,
    events: PropTypes.array.isRequired,
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

  constructor() {
    super();
    autoBind(this);
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
    return this.renderRow(rows, items);
  }

  renderRow(rows, items) {
    return <Row key={rows.length}>{items}</Row>;
  }

  render() {
    const { cols, events, style, hasFeatured, itemStyle } = this.props;
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
        rows.push(this.renderRow(rows, items));
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
    if (items.length !== 0) { rows.push(this.renderRow(rows, items)); }
    return <div style={STYLE}>
      {rows}
    </div>;
  }
}
