import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import EventListItem from "components/EventList/EventListItem";
import { Row } from 'fluid-react';

export default class EventsList extends React.Component {

  static propTypes = {
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
      <div style={{ width: "100%", margin: "0px auto 20px auto" }}>{header}</div>
      {rows}
    </div>;
  }
}
