import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getUserCategories } from "actions/userCategoriesActions";
import UserCategoryItem from "components/UserCategoryList/UserCategoryItem";
import { Container, Row } from 'fluid-react';
import Grid from '@material-ui/core/Grid';

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
    const items = userCategories.map(userCategory => {
      return <UserCategoryItem
          key={userCategory.id}
          categoryImage={userCategory.category.image}
          categoryName={userCategory.category.name}
          onClick={() => alert("click")}
          userImage={userCategory.user.photo}
          username={userCategory.user.name}
        />;
    });

    return <Grid container spacing={8}>{items}</Grid>;
  }
}

export default connect(mapStateToProps)(UserCategoryList);