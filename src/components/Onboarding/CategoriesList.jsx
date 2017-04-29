import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import CategoryListItem from "components/Onboarding/CategoryListItem";

export default class CategoriesList extends React.Component {

  static propTypes = {
    categories: PropTypes.array.isRequired,
    onCategorySelected: PropTypes.func.isRequired,
    selectedCategories: PropTypes.array.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { categories, selectedCategories, onCategorySelected, style } = this.props;
    let items = [];
    const rows = [];
    let combinedCategories = [];
    let filteredCategories = [...categories];
    if (selectedCategories) {
      // This is pretty ugly, but basically we wanted to filter selected categories
      // but ignore any new categories
      filteredCategories = filteredCategories.filter(item => !selectedCategories.some(selectedCat => selectedCat.id === item.id));
      combinedCategories = [...combinedCategories, ...selectedCategories]; 
    }
    combinedCategories = [...combinedCategories, ...filteredCategories];
    if (combinedCategories) {
     combinedCategories.forEach(category => {
        if (items.length === 4) {
          rows.push(<div key={rows.length}>{items}</div>);
          items = [];
        }
        items.push(
          <CategoryListItem
            key={category.id || category.name}
            category={category}
            isSelected={selectedCategories ? selectedCategories.some(item => item.hasOwnProperty("id") && item.id === category.id) : false}
            onClick={onCategorySelected}
            style={items.length === 3 ? { "marginRight": 0 } : {}}
          />
        );
      });
    }
    if (items.length) {
      rows.push(<div key={rows.length}>{items}</div>);
    }
    return <div style={{ width: "100%", height: 500, overflow: "scroll", ...style }}>
      {rows}
    </div>;
  }
}