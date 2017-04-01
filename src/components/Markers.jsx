import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import MapsPlace from "material-ui/svg-icons/maps/place"; 
import { red500, orange600 } from "material-ui/styles/colors";
import EventListItem from './EventList/EventListItem';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Markers extends React.Component {

  static propTypes = {
    isHovered: PropTypes.bool,
    event: PropTypes.object,
    events: PropTypes.object,
    eventEntry: PropTypes.array,
    muiTheme: PropTypes.object,
    $dimensionKey: PropTypes.string,
    markerId: PropTypes.string,
    clickMarker: PropTypes.func,
    sendHoverState: PropTypes.func,
    lat: PropTypes.number,
    lng: PropTypes.number,
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
    console.log('onv')

    this.setState({ isHovered: true });
    this.props.sendHoverState(true);
  }

  mouseLeave() {
    console.log('onv')
    this.setState({ isHovered: false });
    this.props.sendHoverState(false);
  }

  onMarkerClick () {  // For overlapping (not-clickable) markers
    const clickedMarker =  this.props.eventEntry.filter(item => item[1].geoCoordinates.lat === this.props.lat && item[1].geoCoordinates.lng === this.props.lng );
    
    const cardItem = clickedMarker.map((item, index) =>  
      <EventListItem
        eventUid={item[0]}
        event={item[1]}
        muiTheme={this.props.muiTheme}
        popUp={true}
        lat={this.props.lat} 
        lng={this.props.lng} 
        mouseOver={this.mouseEnter}
        mouseOut={this.mouseLeave}
        key={index}
        marginConstant={index}
      />
    );

    const itemId = this.props.$dimensionKey;
    this.props.clickMarker(cardItem, itemId);
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
            color={orange600} 
            onMouseOver={this.mouseEnter} 
            onMouseOut={this.mouseLeave} 
            onClick={this.onMarkerClick}
            hoverColor={orange600}
          />
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
            hoverColor={orange600}
          />
        </div>
      );
    }
  }
}
export default muiThemeable()(Markers);
