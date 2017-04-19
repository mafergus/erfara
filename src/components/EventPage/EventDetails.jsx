import React, { PropTypes } from "react";
import { erfaraBlack, darkGray } from "utils/colors";
import Alarm from 'material-ui/svg-icons/action/alarm';
import Place from 'material-ui/svg-icons/maps/place';
import { Col, Row } from "react-bootstrap";

// const STYLE = {
//   color: darkBlack,
//   fontWeight: "normal",
//   fontSize: "0.8em",
//   display: "inline-block",
// };

export default class EventDetails extends React.Component {

  static propTypes = {
    browser: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  static renderListItem(Icon, title, subtitle) {
    return <div style={{ width: "100%", display: "flex", marginBottom: 32 }}>
      <div style={{ height: "100%", margin: "6px 18px 0px 0px" }}>
        <Icon style={{ color: darkGray }} />
      </div>
      <div style={{ flexGrow: "1" }}>
        <p style={{ color: erfaraBlack, fontSize: "0.9em", marginBottom: "0.4em" }}>{title}</p>
        {subtitle && <p style={{ color: darkGray, fontSize: "0.8em" }}>{subtitle}</p>}
      </div>
    </div>;
  }

  renderTimeTitle() {
    return <div>
      <span style={{ color: erfaraBlack, fontSize: "1em" }}>Time and Place</span>
      <hr style={{ margin: "10px 0px 20px 0px" }} />
    </div>;
  }

  render() {
    const { event, style, browser } = this.props;
    const dateStr = new Date(event.date).toLocaleDateString("en-us", {year: 'numeric', day: "numeric", month: 'long', weekday: 'long'});
    const startTimeStr = new Date(event.startTime).toLocaleTimeString("en-us", {minute: 'numeric', hour: 'numeric'});
    const endTimeStr = new Date(event.endTime).toLocaleTimeString("en-us", {minute: 'numeric', hour: 'numeric'});
    return (
      <div className="border light-shadow" style={{ ...style, backgroundColor: "white", padding: "1.7em 1.7em 0.9em 1.7em", display: "flex" }}>
        <Row>
          <Col xs={12} lg={3} style={{ display: "inline-block" }}>
            {browser.greaterThan.medium && this.renderTimeTitle()}
            <Col xs={12} sm={5} lg={12} style={{ padding: 0 }}>{EventDetails.renderListItem(Alarm, dateStr, startTimeStr + "-" + endTimeStr)}</Col>
            <Col xs={12} sm={5} lg={12} style={{ padding: 0 }}>{EventDetails.renderListItem(Place, event.locationString)}</Col>
          </Col>
          <Col xs={12} lg={6} style={{ display: "inline-block", marginBottom: 50, padding: browser.greaterThan.large ? "0px 80px" : "0px 20px" }}>
            <span style={{ color: erfaraBlack, fontSize: "1em" }}>Details</span>
            <hr style={{ margin: "10px 0px 20px 0px" }} />
            <p style={{ fontSize: "0.9em", color: erfaraBlack }}>{event.description}</p>
          </Col>
          <Col xs={12} lg={3} style={{ display: "inline-block", marginBottom: 50 }}>
            <span style={{ color: erfaraBlack, fontSize: "1em" }}>What to bring</span>
            <hr style={{ margin: "10px 0px 20px 0px" }} />
            <p style={{ fontSize: "0.9em", color: erfaraBlack }}>{event.advices && event.advices.length > 1 ? event.advices : "Just yourself!"}</p>
          </Col>
        </Row>
      </div>
    );
  }
  
}