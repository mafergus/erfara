import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import MapsPlace from "material-ui/svg-icons/maps/place";
import { orange600 } from "material-ui/styles/colors";
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class MapMarker extends React.Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  // mouseEnter() {
  //   this.setState({ isHovered: true });
  //   this.props.sendHoverState(true);
  // }

  // mouseLeave() {
  //   this.setState({ isHovered: false });
  //   this.props.sendHoverState(false);
  // }

  // onMarkerClick () {  // For overlapping (not-clickable) markers
  //   const { event, onClickMarker } = this.props;
  //   onClickMarker(event);
  // }

  render() {
    return <div>
      <MapsPlace
        style={{ height: 55, width: 55 }}
        color={orange600} 
        hoverColor={orange600}
      />
    </div>;
  }
}