import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import Hero from "../Hero";
import RaisedButton from 'material-ui/RaisedButton';

const H3STYLE = {
  fontSize: "1.8em",
  fontWeight: "normal",
  margin: "0 auto",
  marginBottom: "0.3em",
};

const IMG_STYLE = {
  borderRadius: "50%",
  height: "30px",
  width: "30px",
  margin: "0 auto",
  marginRight: "0.6em",
  objectFit: "cover",
  verticalAlign: "middle",
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
    const { style, event, owner, isRSVPD, onRSVPClick } = this.props;
    const rsvp = isRSVPD ? "RSVP -" : "RSVP +";
    return <Hero style={style} title={event && event.title} image={event && event.photo}>
      <div style={{ position: "absolute", bottom: "0px", left: "3px", margin: "0.7em" }}>
        <h3 style={H3STYLE}>{event && event.title}</h3>
        <div>
          <img style={IMG_STYLE} src={owner && owner.photo}/>
          <a style={{ display: "inline-block", height: "100%", verticalAlign: "middle" }}>hosted by {owner.name}</a>
        </div>
      </div>
      <RaisedButton label={rsvp} style={{ position: "absolute", right: 10, bottom: 10 }} onClick={onRSVPClick}/>
    </Hero>;
  }
}