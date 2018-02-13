import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import GoogleMap from 'google-map-react';
import List from "components/EventList/List";
import EventsList from "components/EventList/EventsList";
import UserCategoryList from "components/UserCategoryList/UserCategoryList";
import { erfaraBlack } from "utils/colors";
import { DEFAULT_LOCATION, GOOGLE_MAPS_API_KEY } from "utils/constants";
import GoogleMapLoader from "react-google-maps-loader";
import { orderByDate } from "utils/helpers";
import MapsPlace from "material-ui/svg-icons/maps/place";
import shouldPureComponentUpdate from "react-pure-render/function";
import { orange600 } from "material-ui/styles/colors";
import ReactGoogleMaps from "components/Map/ReactGoogleMaps";

function mapStateToProps(state) {
  return {
    events: orderByDate(Object.entries(state.events.toJS())) || [],
  };
}

export class HomePage extends React.Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    googleMaps: PropTypes.any,
  };

  static defaultProps = {
    googleMaps: {},
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      isPopupOpen: false,
      center: DEFAULT_LOCATION,
      zoom: 10,
      selectedTab: 0,
    };
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  clickMarker(event) {
    this.setState({
      selectedEvent: event,
      isPopupOpen: true,
      center: geoArray
    });
  }

  renderMap() {
    const { events, googleMaps } = this.props;
    const markers = events.map(item => {
      return <div
          key={item[0]}
          lat={item[1].geoCoordinates.latitude}
          lng={item[1].geoCoordinates.longitude}
      >
        <MapsPlace
          style={{ height: 35, width: 35, marginTop: -30, marginLeft: -17 }}
          color={orange600} 
          hoverColor={orange600}
        />
      </div>;
    });

    return (
      <div style={{ width: "100%", height: 240, backgroundColor: "#999" }}>
        <ReactGoogleMaps />
      </div>
    );
  }

  renderHeaders() {
    return <div style={{ width: "100%", marginBottom: 35 }}>
      <div style={{ width: "100%", marginTop: 10 }}>
        <h3 style={{ color: erfaraBlack, margin: 0, display: "inline-block" }}>Upcoming events near you</h3>
        {this.renderTabs()}
      </div>
    </div>;
  }

  renderList() {
    const { events } = this.props;

    return <List 
      header={this.renderHeaders()}
      style={{ width: "100%", marginTop: 30 }}
    >
      {this.state.selectedTab === 0 ? <EventsList events={events} hasFeatured={false} /> : <UserCategoryList />}
    </List>;
  }

  renderTabs() {
    return <span>
      <div style={{ margin: 0, float: "right" }}>
        <span
          className={this.state.selectedTab === 0 ? "tab-text-selected" : "tab-text-unselected"}
          style={{ marginRight: 30 }}
          onClick={() => this.setState({ selectedTab: 0 })}
        >
          Events
        </span>
        <span
        className={this.state.selectedTab === 1 ? "tab-text-selected" : "tab-text-unselected"}
          onClick={() => this.setState({ selectedTab: 1 })}
        >
          People
        </span>
      </div>
    </span>;
  }

  render() {
    return <div>
      {this.renderMap()}
      {this.renderList()}
    </div>;
  }
}

export default connect(mapStateToProps)(HomePage);
