import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import MapsPlace from "material-ui/svg-icons/maps/place"; 
import { orange600 } from "material-ui/styles/colors";

const MARKER_STYLE = {
  width: 55, 
  height: 55, 
  transform: 'scale(0.6, 0.6)', 
  transformOrigin: '28px 55px',
  zIndex: 0
};

export default class MapMarker extends React.Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    onClickMarker: PropTypes.func.isRequired,
    sendHoverState: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isHovered: false,
      isOpen: false
    };
  }

  mouseEnter() {
    this.setState({ isHovered: true });
    this.props.sendHoverState(true);
  }

  mouseLeave() {
    this.setState({ isHovered: false });
    this.props.sendHoverState(false);
  }

  onMarkerClick () {  // For overlapping (not-clickable) markers
    const { event, onClickMarker } = this.props;
    onClickMarker(event);
  }

  render() {
    return <MapsPlace
      style={{ ...MARKER_STYLE, transform: this.state.isHovered ? "scale(1, 1)" : "scale(0.6, 0.6)" }}
      color={orange600} 
      onMouseOver={this.mouseEnter} 
      onMouseOut={this.mouseLeave} 
      onClick={this.onMarkerClick}
      hoverColor={orange600}
    />;
  }
}