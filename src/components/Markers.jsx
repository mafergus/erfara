import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import MapsPlace from "material-ui/svg-icons/maps/place"; 
import { red500, orange500 } from 'material-ui/styles/colors';

export default class Markers extends React.Component {

  static propTypes = {
    isHovered: PropTypes.bool
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isHovered: false
    }
  }

  mouseEnter() {
    this.setState({ isHovered: true });
  }

  mouseLeave() {
    this.setState({ isHovered: false });
  }

  render() {
    const markerStyle = {
      smallMarker: {width:55, height:55, transform:'scale(0.6,0.6)', transformOrigin: '28px 55px'},
      bigMarker: {width:55, height:55, transform:'scale(1,1)', transformOrigin: '28px 55px'}
    };
    if(this.state.isHovered) {
      return (<MapsPlace style={markerStyle.bigMarker} color={red500} hoverColor={orange500} onMouseOver={this.mouseEnter} onMouseOut={this.mouseLeave} />);
    } else {
      return (<MapsPlace style={markerStyle.smallMarker} color={red500} hoverColor={orange500} onMouseOver={this.mouseEnter} onMouseOut={this.mouseLeave} />);
    }
  }
}
