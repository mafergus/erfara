import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import autoBind from "react-autobind";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import CategoriesList from "components/Onboarding/CategoriesList";
import { Search } from "components/Glyphs";
import { addCategories, addCategorySearchResults } from "actions/categoriesActions";
import { autoAddCategory, searchCategories, getPhotoUrl, getCategories, addUserSkill } from "utils/Api";
import FullscreenDialog from "components/Dialog/FullscreenDialog";
import CategoryListItem from "components/Onboarding/CategoryListItem";
import Dialog from "material-ui/Dialog";
import { darkThree } from "utils/colors";

const REQUIRED_CATEGORIES_COUNT = 2;

const BUTTON_CONTAINER_STYLE = {
  height: 75,
  width: "100%",
  backgroundColor: "white",
  boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.08)",
  marginTop: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const MODAL_CONTENT_STYLE = {
  height: "100%",
  backgroundColor: "white",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: 3,
};

const DIALOG_STYLE = {
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  zIndex: 1500,
  background: darkThree,
};

function mapStateToProps(state) {
  const searchResults = state.categories.get("searchResults");
  return {
    authedUser: state.authedUser,
    browser: state.browser,
    categories: state.categories ? state.categories.valueSeq().toArray() : [],
    showModal: state.authedUser.hasOwnProperty("uid") && !state.authedUser.hasOwnProperty("skills"),
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
    authedUser: PropTypes.object.isRequired,
    browser: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    searchResults: PropTypes.array.isRequired,
    showModal: PropTypes.bool,
  };

  static defaultProps = {
    showModal: false,
  };
  
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
      this.setState({ selectedCategories: newSelectedCategories }, () => {
        if (category === this.state.newCategory) {
          this.setState({ searchTerm: "", newCategory: null });
        }
        if (newSelectedCategories.length === 3) {
          this.onSubmit();
        }
      });
    }
  }

  onSubmit() {
    const { authedUser, categories } = this.props;
    this.state.selectedCategories.forEach(category => {
      if (!categories.some(item => item.name === category.name)) {
        autoAddCategory(category.name).then(category => {
          if (category) {
            addUserSkill(authedUser.uid, category.id, category.name);
          }
        });
      } else {
        addUserSkill(authedUser.uid, category.id, category.name);
      }
    });
  }

  renderSearchBox() {
    const { browser } = this.props;
    const SEARCHBOX_STYLE = {
      height: 42,
      minHeight: 42,
      padding: "0px 15px",
      border: "1px solid rgba(0, 0, 0, 0.14)",
      marginBottom: 25,
      display: "flex",
      alignItems: "center",
      marginRight: browser.lessThan.medium ? 26 : 0
    };
    return <div className="border" style={SEARCHBOX_STYLE}>
      <Search style={{ marginRight: 15 }} />
      <TextField
        style={{ width: "100%" }}
        underlineShow={false}
        hintStyle={{ fontSize: "0.9em" }}
        hintText="Enter category here"
        value={this.state.searchTerm}
        onKeyPress={this.onKeyPress}
        onChange={this.onSearchChange}
        autoFocus
      />
    </div>;
  }

  renderSelectedCategories() {
    return <div>
      <h4>Selected Categories</h4>
      <div style={{ width: "100%", height: 200 }}>
        {this.state.selectedCategories.map(category => {
          return <CategoryListItem
            key={category.id || category.name}
            category={category}
            isSelected={false}
          />;
        })}
      </div>
    </div>;
  }

  renderContent() {
    const { browser, categories } = this.props;
    let { searchResults } = this.props;
    if (this.state.searchTerm.length === 0) { searchResults = categories; }
    if (this.state.newCategory && searchResults.length === 0) {
      searchResults = [];
      searchResults.push(this.state.newCategory);
    }
    const padding = browser.lessThan.medium ? "0px 25px" : "0px 50px";
    const width = browser.lessThan.medium ? "100%" : "52%";
    return <div style={{ ...MODAL_CONTENT_STYLE, padding, width }}>
      <h2 style={{ marginBottom: 17 }}>What skills will you teach the community?</h2>
      <h4 style={{ marginBottom: 20 }}>Select {REQUIRED_CATEGORIES_COUNT} or more</h4>
      {this.renderSearchBox()}
      {this.state.selectedCategories.length ? this.renderSelectedCategories() : ""}
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

    // return <Dialog
    //     title="Some Title"
    //     titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: "black" }}
    //     modal={true}
    //     open={true}>
    //     <div style={DIALOG_STYLE}>
    //       {this.renderContent()}
    //     </div>
    //   </Dialog>;

    return <div style={{ ...DIALOG_STYLE, display: showModal ? "flex" : "none" }}>
      {this.renderContent()}
    </div>;

    // return <FullscreenDialog open={true}>
    //   {this.renderContent()}
    // </FullscreenDialog>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingModal);
