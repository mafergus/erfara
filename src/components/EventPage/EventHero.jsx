import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import DateBox from "components/DateBox";
import RaisedButton from 'material-ui/RaisedButton';

// const H3STYLE = {
//   fontSize: "1.8em",
//   fontWeight: "normal",
//   margin: "0 auto",
//   marginBottom: "0.3em",
// };

// const IMG_STYLE = {
//   borderRadius: "50%",
//   height: "30px",
//   width: "30px",
//   margin: "0 auto",
//   marginRight: "0.6em",
//   objectFit: "cover",
//   verticalAlign: "middle",
// };

const HERO_STYLE = {
  position: "relative",
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "50% 40%",
  /*background-blend-mode: multiply;*/
  /*background-color: #F39C11;*/
  objectFit: "cover",
};

export default class EventHero extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    event: PropTypes.object,
    owner: PropTypes.object,
    isRSVPD: PropTypes.bool,
    onRSVPClick: PropTypes.func,
  };

  constructor() {
    super();
    autoBind(this);
  }
  
  render() {
    const { event } = this.props;
    const timestamp = new Date(event.date);
    // const rsvp = isRSVPD ? "RSVP -" : "RSVP +";
    return <div style={{ ...HERO_STYLE, backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${event.photo}')`, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }} >
      <div style={{ width: "75%", height: "100%", position: "relative", margin: "0 auto" }}>
        <div style={{ height: 70, position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <DateBox timestamp={timestamp} style={{ overflow: "hidden" }}/>
          <div style={{ display: "inline-block", height: 70, paddingLeft: 35, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <span style={{ fontSize: "1.7em", verticalAlign: "middle" }}>{event.title}</span>
            </div>
          </div>
          <div style={{ float: "right", height: "100%", display: "flex", alignItems: "center" }}>
            <RaisedButton label="Save" style={{ marginRight: 20 }}/>
            <RaisedButton label="Join" primary />
          </div>
        </div>
      </div>
    </div>;
  }
}
