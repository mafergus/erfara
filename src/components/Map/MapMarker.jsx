import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import MapsPlace from "material-ui/svg-icons/maps/place";
import { orange600 } from "material-ui/styles/colors";
import shouldPureComponentUpdate from 'react-pure-render/function';
import { Place } from "components/Icons/Glyphs";

const HEIGHT = 30;
const WIDTH = 21;

const greatPlaceStyle = {
  fill: orange600,
  position: 'absolute',
  width: WIDTH,
  height: HEIGHT,
  left: -WIDTH / 2,
  top: -HEIGHT,
};

export default class MapMarker extends React.Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = { isHovered: false };
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  mouseEnter() {
    this.setState({ isHovered: true });
    // this.props.sendHoverState(true);
  }

  mouseLeave() {
    this.setState({ isHovered: false });
    // this.props.sendHoverState(false);
  }

  onMarkerClick () {  // For overlapping (not-clickable) markers
    const { event, onClickMarker } = this.props;
    onClickMarker(event);
  }

  render() {
    const scale = this.state.isHovered ? 1 : 0.65;

    return <Place
        style={{ ...greatPlaceStyle, transform: `scale(${scale} , ${scale})`, WebkitTransform: `scale(${scale} , ${scale})` }}
        color={orange600} 
        hoverColor={orange600}
      />;
  }
}