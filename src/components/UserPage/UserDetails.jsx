import React from "react";
import autoBind from "react-autobind";
import { Tabs, Tab } from 'material-ui/Tabs';
import { lightBlack } from "material-ui/styles/colors";
import UserFeed from "../UserFeed/UserFeed"

const TABSTYLE = {
  display: "inline-block",
  marginRight: "35px",
  color: lightBlack,
};

function handleActive(tab) {
  alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
}

export default class UserDetails extends React.Component {
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      selectedTab: 0,
    }
  }

  renderTabs() {
    const tabContent = <div style={{ paddingLeft: "20px", paddingTop: "20px" }}>
      <a style={TABSTYLE} className="userTabs">Feed</a>
      <a style={TABSTYLE} className="userTabs">Skill Postings</a>
      <a style={TABSTYLE} className="userTabs">About</a>
    </div>;
    return tabContent;
  }

  renderNewTabs() {
    return <Tabs>
      <Tab label="Feed" >
        <UserFeed style={{ width: "100%", backgroundColor: "white" }} />
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
      {this.renderNewTabs()}
    </div>
  }
}