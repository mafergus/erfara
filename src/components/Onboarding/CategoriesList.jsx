import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import CategoryListItem from "components/Onboarding/CategoryListItem";

export default class CategoriesList extends React.Component {

  static propTypes = {
    categories: PropTypes.array.isRequired,
    onCategorySelected: PropTypes.func,
    selectedCategories: PropTypes.array.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const { categories, selectedCategories, onCategorySelected } = this.props;
    let items = [];
    let rows = [];
    let combinedCategories = [];
    let filteredCategories = [...categories];
    if (selectedCategories) { 
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
            isSelected={selectedCategories ? selectedCategories.some(item => item.id === category.id) : false}
            onClick={onCategorySelected}
            style={ items.length === 3 ? { "marginRight": 0 } : {} }
          />
        );
      });
    }
    if (items.length) {
      rows.push(<div key={rows.length}>{items}</div>);
    }
    return <div style={{ width: "100%", height: 500, overflow: "scroll" }}>
      {rows}
    </div>;
  }
}