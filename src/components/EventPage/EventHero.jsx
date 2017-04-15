import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import DateBox from "components/DateBox";
import RaisedButton from 'material-ui/RaisedButton';
import AuthModal from "components/auth/AuthModal";

const HERO_STYLE = {
  position: "relative",
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "50% 40%",
  objectFit: "cover",
};

export default class EventHero extends React.Component {

  static propTypes = {
    authedUser: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    isRSVPD: PropTypes.bool.isRequired,
    onRSVPClick: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      signUpModalOpen: false,
    };
  }
  
  render() {
    const { event, isRSVPD, onRSVPClick, authedUser } = this.props;
    const timestamp = new Date(event.date);
    const joinLabel = isRSVPD ? "Leave" : "Join";
    return <div style={{ ...HERO_STYLE, backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${event.photo}')`, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }} >
      <AuthModal 
        title="Sign Up"
        isOpen={this.state.signUpModalOpen}
        handleClose={() => this.setState({ signUpModalOpen: false })} 
      />
      <div style={{ width: "75%", height: "100%", position: "relative", margin: "0 auto" }}>
        <div style={{ height: 70, position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <DateBox timestamp={timestamp} style={{ height: 70, overflow: "hidden" }} />
          <div style={{ display: "inline-block", height: 70, paddingLeft: 35, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <span style={{ fontSize: "1.7em", verticalAlign: "middle" }}>{event.title}</span>
            </div>
          </div>
          <div style={{ float: "right", height: "100%", display: "flex", alignItems: "flex-end", paddingBottom: 5 }}>
            <RaisedButton
              label={joinLabel}
              onClick={Object.keys(authedUser).length > 0 ? onRSVPClick : () => this.setState({ signUpModalOpen: true })}
              primary
            />
          </div>
        </div>
      </div>
    </div>;
  }
}
