import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import Row from "components/GridList/Row";

export default class GridList extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    hasFeatured: PropTypes.bool,
    cols: PropTypes.number,
  };

  static defaultProps = {
    hasFeatured: false,
    cols: 2,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { cols, children, style, hasFeatured } = this.props;
    const rows = [];
    let items = [];
    let processedFeatured = false;
    children.forEach((item, key) => {
      if (hasFeatured && !processedFeatured) {
        rows.push(<Row>{[item]}</Row>);
        processedFeatured = true;
        return;
      }
      if (items.length === cols) {
        rows.push(<Row>{items}</Row>);
        items = [];
      }
      items.push(item);
    });
    if (items.length !== 0) { rows.push(<Row>{children}</Row>) }
    return <div style={style}>{rows}</div>;
  }
}