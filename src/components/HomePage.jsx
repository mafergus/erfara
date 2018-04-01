import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import List from "components/EventList/List";
import EventsList from "components/EventList/EventsList";
import UserCategoryList from "components/UserCategoryList/UserCategoryList";
import { erfaraBlack } from "utils/colors";
import { DEFAULT_LOCATION } from "utils/constants";
import { orderByDate } from "utils/helpers";
import shouldPureComponentUpdate from "react-pure-render/function";
import SimpleMap from "components/Map/SimpleMap";

function mapStateToProps(state) {
  return {
    events: orderByDate(Object.entries(state.events.toJS())) || [],
  };
}

export class HomePage extends React.Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
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
    const { events } = this.props;

    return (
      <div style={{ width: "100%", height: 240, backgroundColor: "#999" }}>
        <SimpleMap events={events} />
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
