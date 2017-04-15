import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import TextField from "material-ui/TextField";

export default class Feed extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.object,
    style: PropTypes.object,
    authedUserPhoto: PropTypes.string.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    hideMessageBar: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    className: "",
    style: {},
    children: null,
  };

  constructor() {
    super();
    autoBind(this);
    this.state = { message: "" };
  }

  onKeyPress(event) {
    const { onSendMessage } = this.props;
    if (event.charCode === 13 && this.state.message.length > 2) { // enter key pressed
      onSendMessage(this.state.message);
      this.setState({ message: "" });
    } 
  }

  renderMessageBar() {
    const { authedUserPhoto } = this.props;
    const STYLE = {
      display: "flex",
      justifyContent: "center",
      margin: "1em 0em",
      ...this.props.style,
    };
    return <div style={STYLE}>
      <img
        src={authedUserPhoto}
        alt="You"
        style={{ height: 50, width: 50, margin: 10, borderRadius: "50%" }}
      />
      <div style={{ flexGrow: "1", height: "100%", alignSelf: "center" }}>
        <TextField 
          hintText="Message"
          value={this.state.message}
          style={{ width: "90%", marginLeft: 10, marginRight: 10 }}
          onKeyPress={this.onKeyPress}
          onChange={(event, value) => { this.setState({ message: value }); }}
        />
      </div>
    </div>;
  }

  render() {
    const { style, className, children, hideMessageBar } = this.props;

    return <div className={className} style={{ ...style, backgroundColor: "white" }}>
      {hideMessageBar ? null : this.renderMessageBar()}
      <hr style={{ margin: "0.8em 0em" }} />
      {children}
    </div>;
  }
}
