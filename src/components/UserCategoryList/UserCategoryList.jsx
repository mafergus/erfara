import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getUserCategories } from "actions/userCategoriesActions";
import UserCategoryItem from "components/UserCategoryList/UserCategoryItem";
import { Container, Row } from 'fluid-react';

function mapStateToProps(state) {
  return {
    userCategories: state.users ? getUserCategories(state) : [],
  };
}

export class UserCategoryList extends React.Component {

  static propTypes = {
    userCategories: PropTypes.array.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { userCategories } = this.props;
    let rowItems = [];
    const rows = [];

    userCategories.forEach(userCategory => {
      if (rowItems.length === 4) {
        rows.push(<Row key={rows.length} style={{ marginBottom: 15 }}>{rowItems}</Row>);
        rowItems = [];
      }
      rowItems.push(<UserCategoryItem
          key={userCategory.id}
          categoryImage={userCategory.category.image}
          categoryName={userCategory.category.name}
          onClick={() => alert("click")}
          userImage={userCategory.user.photo}
          username={userCategory.user.name}
        />);
    });
    rows.push(<Row key={rows.length}>{rowItems}</Row>);

    return <Container>{rows}</Container>;
  }
}

export default connect(mapStateToProps)(UserCategoryList);