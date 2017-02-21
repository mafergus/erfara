import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import { minBlack, darkBlack, orange100 } from "material-ui/styles/colors";
import { getErfaraDate } from "../../utils/dateTimeHelpers";

const ITEM_STYLE = {
  position: "relative",
  border: `1px solid faintBlack`,
  borderRadius: "5%",
  padding: "10px",
  boxShadow: "1px 1px rgba(0,0,0,0.12)"
};

const MY_ITEM_STYLE = {
  backgroundColor: orange100,
  float: "right",
  ...ITEM_STYLE,
};

const THEIR_ITEM_STYLE = {
  backgroundColor: "white",
  float: "left",
  ...ITEM_STYLE,
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
    return <div style={{ width: "100%", height: "auto", overflow: "auto", padding: "5px" }}>
      <div style={ isMine ? MY_ITEM_STYLE : THEIR_ITEM_STYLE }>
        <a style={{ color: darkBlack, fontSize: "0.9em", paddingRight: "60px" }}>{message.message}</a>
        <a style={{ color: minBlack, fontSize: "0.7em", marginLeft: "10px", position: "absolute", right: "7px", bottom: "3px" }}>{getErfaraDate(message.date)}</a>
      </div>
    </div>;
  }

}