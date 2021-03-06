import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import { minBlack, darkBlack, orange100 } from "material-ui/styles/colors";
import Moment from "moment";

const ITEM_STYLE = {
  maxWidth: "65%",
  display: "flex",
  border: `1px solid faintBlack`,
  borderRadius: 15,
  marginTop: 8,
};

const MY_ITEM_STYLE = {
  ...ITEM_STYLE,
  backgroundColor: orange100,
  marginLeft: "auto",
  borderTopRightRadius: 0,
};

const THEIR_ITEM_STYLE = {
  ...ITEM_STYLE,
  backgroundColor: "white",
  marginRight: "auto",
  borderTopLeftRadius: 0,
};

const MESSAGE_STYLE = {
  color: darkBlack,
  margin: "15px 11px 15px 15px",
};

const TIMESTAMP_STYLE = {
  color: minBlack,
  fontSize: "0.8em",
  alignSelf: "flex-end",
  margin: "0px 10px 6px 0px",
  whiteSpace: "nowrap",
};

export default class MessageListItem extends React.Component {

  static propTypes = {
    message: PropTypes.object.isRequired,
    isMine: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { message, isMine, isMobile } = this.props;
    const moment = new Moment(message.date);
    let STYLE = isMine ? MY_ITEM_STYLE : THEIR_ITEM_STYLE;
    STYLE = {
      ...STYLE,
      flexDirection: isMobile ? "column" : "row,"
    };
    return <div style={{ overflow: "auto", display: "flex" }}>
      <div style={STYLE}>
        <span style={MESSAGE_STYLE} className="xs">{message.message}</span>
        <span style={TIMESTAMP_STYLE}>{moment.fromNow()}</span>
      </div>
    </div>;
  }

}