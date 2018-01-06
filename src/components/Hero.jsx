import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";

const HERO_STYLE = {
  position: "relative",
  height: 200,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "50% 40%",
  objectFit: "cover",
};

export default class Hero extends React.Component {

  static propTypes = {
    buttons: PropTypes.node,
    browser: PropTypes.object.isRequired,
    photo: PropTypes.string,
    titleContent: PropTypes.node,
    width: PropTypes.string.isRequired,
    xsTitleContent: PropTypes.node,
  };

  static defaultProps = {
    buttons: null,
    photo: "",
    titleContent: null,
    xsTitleContent: null,
  };

  constructor() {
    super();
    autoBind(this);
  }

  getHeroStyle() {
    const { photo } = this.props;

    return { 
      ...HERO_STYLE,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${photo}')`,
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
    };
  }
  
  render() {
    const { browser, buttons, titleContent, width, xsTitleContent } = this.props;
    const TITLE_CONTAINER_STYLE = {
      width,
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      margin: "0 auto",
    };

    return <div>
      <div style={this.getHeroStyle()} >
        {
          browser.is.extraSmall ? <div style={TITLE_CONTAINER_STYLE}>
            {buttons}
          </div> :
          <div style={TITLE_CONTAINER_STYLE}>
            {titleContent}
            {buttons}
          </div>
        }
      </div>
      {browser.is.extraSmall && xsTitleContent}
    </div>;
  }
}
