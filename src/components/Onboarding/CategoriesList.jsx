import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import Measure from 'react-measure';
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

    this.state = {
      dimensions: {
        width: -1,
        height: -1,
      },
    };
  }

  render() {
    const { categories, selectedCategories, onCategorySelected, style } = this.props;
    const { width } = this.state.dimensions;
    const numItems = Math.floor((width + 22) / 160);
    let items = [];
    const rows = [];
    let combinedCategories = [];
    let filteredCategories = [...categories];
    if (selectedCategories) {
      // This is pretty ugly, but basically we wanted to filter selected categories
      // but ignore any new categories
      filteredCategories = filteredCategories.filter(item => !selectedCategories.some(selectedCat => selectedCat.id === item.id));
    }
    combinedCategories = [...combinedCategories, ...filteredCategories];
    if (combinedCategories) {
     combinedCategories.forEach(category => {
        if (items.length === numItems) {
          rows.push(<div key={rows.length}>{items}</div>);
          items = [];
        }
        items.push(
          <CategoryListItem
            key={category.id || category.name}
            category={category}
            isSelected={selectedCategories ? selectedCategories.some(item => item.hasOwnProperty("id") && item.id === category.id) : false}
            onClick={onCategorySelected}
            style={items.length === numItems-1 ? { "marginRight": 0 } : {}}
          />
        );
      });
    }
    if (items.length) {
      rows.push(<div key={rows.length}>{items}</div>);
    }
    return <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({ dimensions: contentRect.bounds });
        }}
      >
        {({ measureRef }) => {
            return <div ref={measureRef} style={{ width: "100%", height: 500, overflow: "scroll", ...style }}>
              {rows}
            </div>;
          }
        }
      </Measure>;
  }
}