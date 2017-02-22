import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { Tabs, Tab } from 'material-ui/Tabs';
import UserFeed from "../UserFeed/UserFeed"

function handleActive(tab) {
}

export default class UserDetails extends React.Component {

  static PropTypes = {
    user: PropTypes.object.isRequired,
  }
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      selectedTab: 0,
    }
  }

  renderTabs() {
    return <Tabs>
      <Tab label="Feed" >
        <UserFeed style={{ width: "100%", backgroundColor: "white" }} user={this.props.user} />
      </Tab>
      <Tab label="Skill Postings" >
        <div>
          <h2>Tab Two</h2>
          <p>
            This is another example tab.
          </p>
        </div>
      </Tab>
      <Tab
        label="About"
        data-route="/home"
        onActive={handleActive}
      >
        <div>
          <h2>Tab Three</h2>
          <p>
            This is a third example tab.
          </p>
        </div>
      </Tab>
    </Tabs>;
  }

  render() {
    return <div style={{ width: "100%", height: "400px", backgroundColor: "white" }}>
      {this.renderTabs()}
    </div>
  }
}