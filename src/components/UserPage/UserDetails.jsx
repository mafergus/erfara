import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { erfaraBlack, darkGray } from "utils/colors";
import Home from 'material-ui/svg-icons/action/home';
import Karma from 'material-ui/svg-icons/action/favorite-border';
import Place from 'material-ui/svg-icons/maps/place';
import Face from 'material-ui/svg-icons/action/face';
import Moment from "moment";

// const STYLE = {
//   color: darkBlack,
//   fontWeight: "normal",
//   fontSize: "0.8em",
//   display: "inline-block",
// };

export default class UserDetails extends React.Component {

  static propTypes = {
    user: PropTypes.object,
    style: PropTypes.object,
  };

  constructor() {
    super();
    autoBind(this);
  }

  renderListItem(Icon, text) {
    return <div style={{ width: "100%", display: "flex", marginBottom: 16 }}>
      <div style={{ height: "100%", margin: "6px 12px 0px 0px" }}>
        <Icon style={{ color: darkGray }}/>
      </div>
      <div style={{ flexGrow: "1", display: "flex", alignItems: "center" }}>
        <p style={{ color: erfaraBlack, fontSize: "0.9em" }}>{text}</p>
      </div>
    </div>;
  }

  render() {
    const { style, user } = this.props;
    const age = user.birthday ? Moment().diff(user.birthday, "years") : 30;
    const location = user.location ? user.location : "Earth";
    const hometown = user.hometown ? user.hometown : "Earth";
    debugger;
    return (
      <div className="border light-shadow" style={{ ...style, backgroundColor: "white", padding: "1.7em 1.7em 0.9em 1.7em", display: "flex" }}>
        <div style={{ height: "100%", width: "25%", display: "inline-block" }}>
          <span style={{ color: erfaraBlack, fontSize: "1em" }}>Details</span>
          <hr style={{ margin: "10px 0px 20px 0px" }} />
          {this.renderListItem(Home, "Lives in " + location)}
          {this.renderListItem(Place, "From " + hometown)}
          {this.renderListItem(Face, age + " years old")}
          {this.renderListItem(Karma, "78 Karma Points")}
        </div>
        <div style={{ height: "100%", width: "50%", display: "inline-block", padding: "0 80px" }}>
          <span style={{ color: erfaraBlack, fontSize: "1em" }}>Bio</span>
          <hr style={{ margin: "10px 0px 20px 0px" }} />
          <p style={{ fontSize: "0.9em", color: erfaraBlack }}>This is where the user bio will go and eventually there will be some stuff in here that describes the user although who knows if people will actually want to fill this out or not or be happy with the bio we get from Facebook</p>
        </div>
        <div style={{ height: "100%", width: "25%", display: "inline-block" }}>
          <span style={{ color: erfaraBlack, fontSize: "1em" }}>Interests</span>
          <hr style={{ margin: "10px 0px 20px 0px" }} />
          <p style={{ fontSize: "0.9em", color: erfaraBlack }}>Basketball  •  Chess  •  Spanish  •  Traveling • Learning Language  •  Food  •  Meditation  •  The Human Brain  •  Movement  •  Exercise</p>
        </div>
      </div>
    );
  }
  
}