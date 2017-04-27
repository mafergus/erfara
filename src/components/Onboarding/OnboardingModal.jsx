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
import { dismissModal } from "actions/onboardingActions";
import { autoAddCategory, searchCategories, getPhotoUrl, getCategories, addUserSkill } from "utils/Api";

const REQUIRED_CATEGORIES_COUNT = 2;

const BUTTON_CONTAINER_STYLE = {
  height: 75,
  width: "100%",
  backgroundColor: "white",
  boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.08)",
  marginTop: 8,
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bottom: 0,
  left: 0,
  right: 0
};

function mapStateToProps(state) {
  const searchResults = state.categories.get("searchResults");
  return {
    authedUser: state.authedUser,
    categories: state.categories ? state.categories.valueSeq().toArray() : [],
    showModal: state.onboarding.showModal,
    searchResults: searchResults ? searchResults.valueSeq().toArray() : [],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addCategories, addCategorySearchResults, dismissModal }, dispatch);
}

export class OnboardingModal extends React.Component {

  static propTypes = {
    addCategories: PropTypes.func.isRequired,
    addCategorySearchResults: PropTypes.func.isRequired,
    authedUser: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    dismissModal: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    showModal: PropTypes.bool.isRequired,
  }
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      searchTerm: "",
      selectedCategories: [],
      newCategory: null,
      keyboardFocused: false,
    };
  }

  componentWillMount() {
    const { addCategories } = this.props;
    debugger;
    getCategories().then(categories => addCategories(categories));
  }

  onKeyPress(event) {
    if (event.charCode === 13 && this.state.searchTerm.length >= 2) { // enter key pressed
      searchCategories(this.state.searchTerm).then(categories => addCategorySearchResults(categories));
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
      const updatedCategory = { ...category };
      if (!updatedCategory.hasOwnProperty("id")) {
        updatedCategory.id = category.name;
      }
      newSelectedCategories = [...this.state.selectedCategories, updatedCategory];
      this.setState({ selectedCategories: newSelectedCategories });
      if (category === this.state.newCategory) {
        this.setState({ searchTerm: "", newCategory: null });
      }
    }
  }

  onSubmit() {
    const { authedUser, categories, dismissModal } = this.props;
    this.state.selectedCategories.forEach(category => {
      if (!categories.some(item => item.name === category.name)) {
        autoAddCategory(category.name).then(category => {
          if (category) {
            addUserSkill(authedUser.uid, category.id);
          }
        });
      } else {
        addUserSkill(authedUser.uid, category.id);
      }
    });
    dismissModal();
  }

  renderContent() {
    const { categories } = this.props;
    let { searchResults } = this.props;
    if (this.state.searchTerm.length === 0) { searchResults = categories; }
    if (this.state.newCategory && searchResults.length === 0) {
      searchResults = [];
      searchResults.push(this.state.newCategory);
    }
    return <div style={{ padding: "0px 50px", position: "relative" }}>
      <h2 style={{ marginBottom: 20 }}>What skills will you teach the community?</h2>
      <h4 style={{ marginBottom: 30 }}>Select {REQUIRED_CATEGORIES_COUNT} or more</h4>
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
      <div style={BUTTON_CONTAINER_STYLE}>
        <RaisedButton 
          style={{ width: 200 }}
          label="Done"
          disabled={this.state.selectedCategories.length < 2}
          keyboardFocused={this.state.selectedCategories.length >= 2}
          onTouchTap={this.onSubmit}
          primary
        />
      </div>
    </div>;
  }

  render() {
    const { showModal } = this.props;
    return <Dialog
      style={{ padding: 0 }}
      open={showModal}
      modal={false}
    >
      {this.renderContent()}
    </Dialog>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingModal);
