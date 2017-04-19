import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { lightBlack } from "material-ui/styles/colors";

const PADDING = 10;

const DIV_STYLE = {
  display: "flex",
  alignItems: "center",
  marginRight: 2,
};

const CHILD_STYLE = {
  height: 29,
  width: 29,
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.12)",
  display: "inline-block",
  marginRight: PADDING,
};

const CHILD_CONTAINER_STYLE = {
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const IMG_STYLE = {
  height: 26,
  width: 26,
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: 10,
};

export default class Attendees extends React.Component {

  static propTypes = {
    attendees: PropTypes.array.isRequired,
    className: PropTypes.string,
    extended: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.node,
  };

  static defaultProps = {
    className: "",
    extended: false,
    style: {},
    title: "",
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { extended, attendees, className, style, title } = this.props;
    const STYLE = {
      ...DIV_STYLE,
      ...style,
      backgroundColor: "white",
      paddingRight: 8,
    };
    let children = [];
    if (!attendees) { return null; }
    if (extended) {
      children = attendees.map(user => user && <img alt="Attendee" key={user.uid} style={IMG_STYLE} src={user.photo} />);
    } else {
      children.push(attendees[0] && <img
          alt="Attendee"
          key={attendees[0].uid}
          style={IMG_STYLE}
          src={attendees[0] && attendees[0].photo}
        />);
      if (attendees.length > 1) {
        children.push(<div key="123" style={CHILD_STYLE}>
          <div style={CHILD_CONTAINER_STYLE}>
            <span style={{ color: lightBlack, verticalAlign: "middle", fontSize: "0.8em" }}>{`+${attendees.length-1}`}</span>
          </div>
        </div>);
      }
    }

    return <div style={STYLE} className={className}>
      {title}
      {children}
    </div>;
  }
}