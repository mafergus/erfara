import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getUserCategories } from "actions/userCategoriesActions";
import UserCategoryItem from "components/UserCategoryList/UserCategoryItem";
import { Row } from "react-bootstrap";

function mapStateToProps(state) {
  return {
    userCategories: state.users ? getUserCategories(state) : [],
  };
}

export class UserCategoryList extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    userCategories: PropTypes.array.isRequired,
  };

  static defaultProps = {
    style: {},
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { style, userCategories } = this.props;

    return <Row style={style}>
      {userCategories.map(userCategory => {
        return <UserCategoryItem
          key={userCategory.id}
          categoryImage={userCategory.category.image}
          categoryName={userCategory.category.name}
          onClick={() => alert("click")}
          userImage={userCategory.user.photo}
          username={userCategory.user.name}
        />;
      })}
    </Row>;
  }
}

export default connect(mapStateToProps)(UserCategoryList);