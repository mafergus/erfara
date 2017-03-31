import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import MapsPlace from "material-ui/svg-icons/maps/place"; 
import { red500 } from "material-ui/styles/colors";
import EventListItem from './EventList/EventListItem';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Markers extends React.Component {

  static propTypes = {
    isHovered: PropTypes.bool,
    event: PropTypes.object,
    muiTheme: PropTypes.object,
    $dimensionKey: PropTypes.string
  };

  constructor() {
    super();
    autoBind(this);

    this.card = '';

    this.state = {
      isHovered: false,
      isPopupOpen: false,
    };
  }

  mouseEnter() {
    this.setState({ isHovered: true });
  }

  mouseLeave() {
    this.setState({ isHovered: false });
  }

  onMarkerClick () {
      this.card = 
      <div style={{zIndex: 9999999999999}}>
        <EventListItem           
          eventUid={this.props.$dimensionKey}
          event={this.props.event}
          muiTheme={this.props.muiTheme}
          popUp={true}
        />
      </div>;
      this.setState({isPopupOpen: !this.state.isPopupOpen});
  }

  render() {
    const markerStyle = {
      smallMarker: { 
        width:55, 
        height:55, 
        transform:'scale(0.6,0.6)', 
        transformOrigin: '28px 55px',
        zIndex: 0
      },
      bigMarker: {
        width:55, 
        height:55, 
        transform:'scale(1,1)', 
        transformOrigin: '28px 55px',
        zIndex: 0
      }
    };

    if(this.state.isHovered) {
      return ( 
        <div>
          <MapsPlace
            style={markerStyle.bigMarker} 
            color={red500} 
            onMouseOver={this.mouseEnter} 
            onMouseOut={this.mouseLeave} 
            onClick={this.onMarkerClick}
          />
          {this.state.isPopupOpen ? this.card : <div></div> }
        </div>
      );
    } else {
      return ( 
        <div>
          <MapsPlace
            style={markerStyle.smallMarker} 
            color={red500} 
            onMouseOver={this.mouseEnter} 
            onMouseOut={this.mouseLeave} 
            onClick={this.onMarkerClick}
          />
          {this.state.isPopupOpen ? this.card : <div></div> }
        </div>
      );
    }
  }
}
export default muiThemeable()(Markers);
