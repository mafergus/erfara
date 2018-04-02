import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import { orange600 } from "material-ui/styles/colors";
import shouldPureComponentUpdate from 'react-pure-render/function';
import { Place } from "components/Icons/Glyphs";

const HEIGHT = 30;
const WIDTH = 21;

const STYLE = {
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
    hovered: PropTypes.bool.isRequired,
    onClickMarker: PropTypes.func,
    onMouseOver: PropTypes.func.isRequired,
    onMouseExit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onClickMarker: null,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = { isHovered: false };
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  onMouseEnter() {
    const { event, onMouseOver } = this.props;
    // this.setState({ isHovered: true });
    onMouseOver(event);
  }

  onMouseExit() {
    const { event, onMouseExit } = this.props;
    // this.setState({ isHovered: false });
    onMouseExit(event);
  }

  onMarkerClick() { // For overlapping (not-clickable) markers
    const { event, onClickMarker } = this.props;
    onClickMarker(event);
  }

  getStyle(scale) {
    return { ...STYLE, top: -HEIGHT*scale };
  }

  render() {
    const scale = this.props.hovered ? 1 : 0.65;

    return <Place
        style={{ ...this.getStyle(scale), transform: `scale(${scale} , ${scale})`, WebkitTransform: `scale(${scale} , ${scale})` }}
        onMouseOver={this.onMouseEnter}
        onMouseOut={this.onMouseExit}
        color={orange600} 
      />;
  }
}