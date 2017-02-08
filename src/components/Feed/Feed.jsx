import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { darkBlack } from "material-ui/styles/colors";

function mapStateToProps(state, props) {
  return {
    items: state.feed.get(props.uuid),
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export class Feed extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    uuid: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);
  }

  renderFeedItem() {
    return <div style={{ display: "flex", padding: "20px", width: "100%" }}>
      <div style={{ width: "100px" }}>
        <img style={{ height: "40px", width: "40px", borderRadius: "50%", verticalAlign: "top" }} src="https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/11009152_10105063465546270_5215382255678934863_n.jpg?oh=185a667a757d3d5f38824901c1c1d3ab&oe=5923891C"/>
      </div>
      <div style={{ height: "100%", flexGrow: "1" }}>
        <span style={{ color: darkBlack }}>This is a comment on a super cool event I'm sure it's gonna be super fun!!</span>
      </div>
      <hr/>
    </div>;
  }

  render() {
    const { style } = this.props;
    return <div style={style} className="border">
      <hr/>
      <h2 style={{ color: darkBlack }}>Feed</h2>
      {this.renderFeedItem()}
      {this.renderFeedItem()}
      {this.renderFeedItem()}
      {this.renderFeedItem()}
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);