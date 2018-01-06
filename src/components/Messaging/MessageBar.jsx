import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import TextField from 'material-ui/TextField';
import { faintBlack } from "material-ui/styles/colors";

export default class MessageBar extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    onSend: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {},
  };
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      message: "",
    };
  }

  onSendClicked() {
    const { onSend } = this.props;
    onSend(this.state.message);
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
      borderTop: `1px solid ${faintBlack}`,
      backgroundColor: "white",
      height: 140,
      zIndex: "30",
    };
    return <div style={STYLE}>
      <TextField 
        hintText="Message"
        value={this.state.message}
        style={{ width: "80%", marginLeft: 28, marginTop: 10 }}
        onKeyPress={this.onKeyPress}
        onChange={(event, value) => { this.setState({ message: value }); }}
        autoFocus
      />
    </div>;
  }
}