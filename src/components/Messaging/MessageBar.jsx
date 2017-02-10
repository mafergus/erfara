import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import SendIcon from 'material-ui/svg-icons/content/send';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { lightBlack, faintBlack, orange50, orange200, orange500 } from "material-ui/styles/colors";

export default class MessageBar extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    onSend: PropTypes.func,
  }
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      message: "",
    }
  }

  onSendClicked() {
    this.props.onSend(this.state.message);
    this.setState({ message: "" });
  }

  onKeyPress(event) {
    if (event.charCode === 13) { // enter key pressed
      this.onSendClicked();  
    } 
  }

  render() {
    const { style } = this.props;
    const STYLE = {
      ...style,
      display: "flex",
      justifyContent: "center",
      borderTop: `1px solid ${faintBlack}`,
      backgroundColor: orange50,
      zIndex: "30",
    };
    return <div style={STYLE}>
      <div style={{ flexGrow: "1", height: "100%", width: "100%", backgroundColor: {orange500} }}>
        <div style={{ height: "90px", border: `1px solid" ${faintBlack}`, backgroundColor: "white", borderRadius: "3%" }}>
          <TextField 
            hintText="Message"
            value={this.state.message}
            style={{ width: "100%" }}
            onKeyPress={this.onKeyPress}
            onChange={ (event, value) => { this.setState({ message: value }) }} />
        </div>
      </div>
      <div style={{ padding: "21px",}}>
        <IconButton
          style={{ height: "50px", width: "50px", padding: "10px", paddingLeft: "15px" }}
          iconStyle={{ height: "30px", width: "30px", margin: "auto", color: lightBlack }}
          onClick={this.onSendClicked}
        >
          <SendIcon hoverColor={orange200} />
        </IconButton>
      </div>
    </div>;
  }
}