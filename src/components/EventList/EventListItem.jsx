import React, { PropTypes } from "react";
import autoBind from "react-autobind"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { GridTile } from 'material-ui/GridList';
import Face from 'material-ui/svg-icons/action/face';
import IconButton from 'material-ui/IconButton';
import { white } from "material-ui/styles/colors";
import { getUser } from "actions/userActions";
import { erfaraBlack } from "utils/colors";
import { getShortMonth } from "utils/dateTimeHelpers";

function mapStateToProps(state, props) {
  const event = state.events.get(props.eventUid);
  return {
    event,
    user: event && state.users.get(event.userId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch);
}

export class EventListItem extends React.Component {

  static PropTypes = {
    event: PropTypes.object.isRequired,
    eventUid: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  componentWillMount() {
    const { event, getUser } = this.props;
    if (event) {
      getUser(event.userId);
    }
  }

  render() {
    const { event, eventUid, user } = this.props;
    const timestamp = new Date(event.date);
    return <Link to={`/event/${eventUid}`} style={{ textDecoration: "none" }}>
      <div style={{ width: 333, height: 250 }} className="shadow border">
        <img src={event.photo} alt="Event" style={{ width: "100%", height: 181, objectFit: "cover" }} />
        <div style={{ width: "100%", height: 70, marginTop: -5, position: "relative", display: "flex" }}>
          <div style={{ height: "100%", width: 70, display: "inline-block", borderRight: "1px solid rgba(0, 0, 0, 0.06)" }}>
            <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                <p style={{ fontSize: "0.8em", fontWeight: "300", color: erfaraBlack }}>{getShortMonth(timestamp)}</p>
                <p style={{ fontSize: "1.1em", fontWeight: "200", color: erfaraBlack }}>{timestamp.getDate()}</p>
              </div>
            </div>
          </div>
          <div style={{ height: "100%", flexGrow: "1", display: "flex", alignItems: "center", paddingLeft: "17px" }}>
            <p style={{ color: "#424242", textAlign: "left" }}>
              <span style={{ fontSize: "1em" }}>{event.title}</span>
              <br/>
              <span style={{ fontSize: "0.8em" }}>Fri 8PM &nbsp; &#8226; &nbsp; {event.locationString}</span>
            </p>
          </div>
          <div>
            <div style={{ height: 40, width: 40, borderRadius: "50%", backgroundColor: "gray" }}/>
          </div>
        </div>
      </div>
    </Link>;

      <GridTile
        key={eventUid}
        style={{ width: 333, height: 250 }}
        title={event.title}
        subtitle={user && <div><img src={user.photo} alt="Creator" style={{ width: "20px", height: "20px", borderRadius: "50%" }}/>{user.name}</div>}
        actionIcon={<IconButton><span style={{ color: white, fontSize: "2em" }}>3</span><Face color="white" /></IconButton>}
      >
        
      </GridTile>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListItem);