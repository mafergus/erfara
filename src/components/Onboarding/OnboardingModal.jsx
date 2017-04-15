import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import autoBind from "react-autobind";
import Dialog from 'material-ui/Dialog';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import CategoriesList from "components/Onboarding/CategoriesList";
import { Search } from "components/Glyphs";
import { addCategories, addCategorySearchResults } from "actions/categoriesActions";
import { searchCategories, getPhotoUrl, getCategories } from "utils/Api";
// import { erfaraBlack } from "utils/colors";

function mapStateToProps(state) {
  const searchResults = state.categories.get("searchResults");
  return {
    categories: state.categories ? state.categories.valueSeq().toArray() : [],
    searchResults: searchResults ? searchResults.valueSeq().toArray() : [],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addCategories, addCategorySearchResults }, dispatch);
}

export class OnboardingModal extends React.Component {

  static propTypes = {
    addCategories: PropTypes.func.isRequired,
    addCategorySearchResults: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    handleClose: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
  }
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      searchTerm: "",
      selectedCategories: [],
      newCategory: null,
    };
  }

  componentWillMount() {
    const { addCategories } = this.props;
    getCategories().then(categories => addCategories(categories));
  }

  onKeyPress(event) {
    if (event.charCode === 13 && this.state.searchTerm.length > 2) { // enter key pressed
      searchCategories(this.state.searchTerm).then(categories => {
        addCategorySearchResults(categories);
      });
      // this.setState({ searchTerm: "" });
    } 
  }

  onSearchChange(event, value) {
    const { searchResults, addCategorySearchResults } = this.props;
    if (this.state.searchTerm.length === 0) {
      this.setState({ searchTerm: value.toUpperCase() });  
    } else {
      this.setState({ searchTerm: value });
    }
    searchCategories(value).then(categories => addCategorySearchResults(categories))
    .then(() => {
      if (searchResults.length === 0 && value.length > 1) {
        this.setState({ newCategory: { name: value } });
        getPhotoUrl(value, true).then(url => {
          const updatedCategory = this.state.newCategory;
          this.setState({ newCategory: {...updatedCategory, image: url} });
        });
      }
    });
  }

  onCategorySelected(category) {
    let newSelectedCategories = [];
    if (this.state.selectedCategories.some(item => category.id === item.id)) {
      this.state.selectedCategories.splice(this.state.selectedCategories.indexOf(category), 1);
      this.setState({ selectedCategories: this.state.selectedCategories });
    } else {
      newSelectedCategories = [...this.state.selectedCategories, category];
      this.setState({ selectedCategories: newSelectedCategories });
    }
  }

  renderContent() {
    const { categories } = this.props;
    let { searchResults } = this.props;
    if (this.state.searchTerm.length === 0) { searchResults = categories; }
    if (this.state.newCategory && searchResults.length === 0) {
      searchResults = [];
      searchResults.push(this.state.newCategory);
    }
    return <div style={{ padding: "0px 50px" }}>
      <h2 style={{ marginBottom: 20 }}>What skills will you teach the community?</h2>
      <h4 style={{ marginBottom: 30 }}>Select 3 or more</h4>
      <div className="border" style={{ height: 42, padding: "0px 15px", marginBottom: 25, display: "flex", alignItems: "center" }}>
        <Search style={{ marginRight: 15 }} />
        <TextField
          style={{ width: "100%" }}
          underlineShow={false}
          hintText="chess, unicycling, surfing…"
          value={this.state.searchTerm}
          onKeyPress={this.onKeyPress}
          onChange={this.onSearchChange}
        />
      </div>
      <CategoriesList
        categories={searchResults}
        onCategorySelected={this.onCategorySelected}
        selectedCategories={this.state.selectedCategories}
      />
      <div style={{ height: 65, backgroundColor: "blue" }}>
        <RaisedButton 
          label="Continue"
          onClick={this.onSubmit}
          primary
        />
      </div>
    </div>;
  }

  render() {
    const { handleClose } = this.props;
    return <Dialog
      open={false}
      modal={false}
      onRequestClose={handleClose}
    >
      {this.renderContent()}
    </Dialog>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingModal);
