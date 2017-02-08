import React, { PropTypes } from "react";
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class Hero extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    image: PropTypes.string,
    subtitle: PropTypes.node,
    onFabClick: PropTypes.func,
  };
  
  constructor() {
    super();
  }

  render() {
    const { title, image, subtitle, onFabClick, children } = this.props;
    const STYLE = {
      position: "relative",
      height: "250px",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url('${image}')`,
      backgroundSize: "cover",
      backgroundPosition: "50% 40%",
      /*background-blend-mode: multiply;*/
      /*background-color: #F39C11;*/
      objectFit: "cover",
    };
    return <div style={ STYLE }>
      {children}
    </div>;
  }
}