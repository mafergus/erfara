import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { minBlack, darkBlack, orange100 } from "material-ui/styles/colors";
import Moment from "moment";

const ITEM_STYLE = {
  maxWidth: "65%",
  display: "inline-block",
  position: "relative",
  border: `1px solid faintBlack`,
  borderRadius: 15,
  padding: 13,
  paddingBottom: 16,
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

export default class MessageListItem extends React.Component {

  static propTypes = {
    message: PropTypes.object,
    isMine: PropTypes.bool,
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { message, isMine } = this.props;
    const moment = new Moment(message.date);
    return <div style={{ overflow: "auto", display: "flex", padding: "5px" }}>
      <div style={ isMine ? MY_ITEM_STYLE : THEIR_ITEM_STYLE }>
        <span style={{ color: darkBlack, fontSize: "1em", paddingRight: "60px" }}>{message.message}</span>
        <span style={{ color: minBlack, fontSize: "0.8em", marginLeft: "10px", position: "absolute", right: 12, bottom: 5 }}>{moment.fromNow()}</span>
      </div>
    </div>;
  }

}