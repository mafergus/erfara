import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import autoBind from "react-autobind";
import firebase from "firebase";
import store from "store/store";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import { Container, Row, Col } from 'fluid-react';
import { autoAddCategory, updateCategory, getPhotos, uploadFile, deleteCategory } from "utils/Api";

const CATEGORY_ITEM_STYLE = {
  height: 200,
  width: 200,
  backgroundPosition: "50% 50%",
  backgroundSize: "cover",
  backgroundBlendMode: "multiply",
  backgroundColor: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function mapStateToProps(state) {
  return {
    categories: state.categories,
    images: state.images,
  };
}

export class CategoriesPage extends React.Component {

  static propTypes = {
    categories: PropTypes.object.isRequired,
    images: PropTypes.array.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      category: "",
      photoDialogOpen: false,
      categoryModalOpen: false,
      photoLoading: false,
    };

    firebase.database().ref('/categories').orderByChild("name").on('value', snapshot => {
      const categories = [];
      snapshot.forEach(child => {
        const value = child.val();
        categories.push({ ...value, id: child.key });
      });
      if (categories) {
        store.dispatch({ type: "GET_CATEGORIES_SUCCESS", categories });
      }
    });
  }

  onKeyPress(event) {
    if (event.charCode === 13 && this.state.category.length > 2) { // enter key pressed
      autoAddCategory(this.state.category).then(() => {
        this.setState({ category: "" });
      }).catch(error => alert(error));
      this.setState({ category: "" });
    } 
  }

  getImages() {
    getPhotos(this.state.selectedCategory.name).then(json => store.dispatch({ type: "GET_IMAGES_SUCCESS", images: json.hits }));
    this.setState({ 
      photoDialogOpen: true,
    });
  }

  addCategory(image) {
    autoAddCategory(this.state.category, image).then(() => {
      this.setState({ 
        category: "",
        photoDialogOpen: false,
      });
    });
  }

  updateCategoryImage(image) {
    this.setState({ photoLoading: true });
    const category = this.state.selectedCategory;
    fetch(image.webformatURL)
    .then(response => {
      if (response && response.ok) {
        return response.blob();
      }
    }).then(blob => uploadFile(blob, "categoryImages/"))
    .then(url => updateCategory(category.id, category.name, url))
    .then(category => { 
      this.setState({
        selectedCategory: category,
        photoDialogOpen: false,
      });
    });
  }

  updateCategoryName(event) {
    const category = this.state.selectedCategory;
    if (event.charCode === 13) {
      updateCategory(category.id, this.state.newName, category.image);
      this.setState({ 
        categoryModalOpen: false,
        photoLoading: false,
      });
    }
  }

  deleteCategory(category) {
    deleteCategory(category);
    this.setState({ categoryModalOpen: false });
  }

  renderPhotosModal() {
    const { images } = this.props;
    let rowItems = [];
    const rows = [];
    images.forEach(image => {
      if (rowItems.length === 4) {
        rows.push(<Row key={rows.length}>{rowItems}</Row>);
        rowItems = [];
      }
      rowItems.push(<Col key={image.previewURL} lg={3}>
        <div onClick={this.updateCategoryImage.bind(null, image)} style={{ backgroundImage: `url(${image.previewURL})`, backgroundPosition: "50% 50%", backgroundSize: "cover", height: 200, width: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        </div>
      </Col>);
    });
    if (rowItems.length) {
      rows.push(<Row key={rows.length}>{rowItems}</Row>);
    }
    return <Dialog
      style={{ zIndex: 9000 }}
      modal={false}
      onRequestClose={() => this.setState({ photoDialogOpen: false, photoLoading: false })}
      open={this.state.photoDialogOpen}>
      <div style={{ overflowY: "scroll", width: "100%", height: 500, backgroundColor: "green" }}>
        {rows}
      </div>
    </Dialog>;
  }

  renderCategoryModal() {
    const category = this.state.selectedCategory;
    return <Dialog
      modal={false}
      onRequestClose={() => this.setState({ categoryModalOpen: false, photoLoading: false, photoDialogOpen: false })}
      open={this.state.categoryModalOpen}>
      {this.state.photoLoading ? <CircularProgress /> :
       <div style={{ overflowY: "scroll", width: "100%", height: 500 }}>
        <img style={{ width: 640, height: 280 }} src={category && category.image} />
        <RaisedButton onTouchTap={this.getImages} primary>Change Image</RaisedButton>
        <br />
        <TextField 
          hintText="Name"
          defaultValue={category ? category.name : ""}
          onChange={(event, value) => { this.setState({ newName: value }); }}
          onKeyPress={this.updateCategoryName}
        />
        <br />
        <RaisedButton onTouchTap={this.deleteCategory.bind(null, category && category.id)} primary>Delete</RaisedButton>
      </div>}
    </Dialog>;
  }

  renderCategoryItem(key, category) {
    return <div
      onClick={() => this.setState({ categoryModalOpen: true, selectedCategory: category })}
      className="hoverable"
      style={{ ...CATEGORY_ITEM_STYLE, backgroundImage: `url(${category.image})` }}
    >
      <p style={{ color: "white", fontSize: "1.4em" }}>{category.name}</p>
    </div>;
  }

  render() {
    const { categories } = this.props;
    if (!categories) { return null; }
    let rowItems = [];
    const rows = [];

    categories.forEach((category, key) => {
      if (rowItems.length === 4) {
        rows.push(<Row key={rows.length} style={{ marginBottom: 15 }}>{rowItems}</Row>);
        rowItems = [];
      }
      rowItems.push(<Col key={rowItems.length} lg={3}>
        {this.renderCategoryItem(key, category)}
      </Col>);
    });
    rows.push(<Row key={rows.length}>{rowItems}</Row>);
    return <Container>
      {this.renderPhotosModal()}
      {this.renderCategoryModal()}
      <div style={{ margin: "50px 0px" }}>
        <p style={{ color: "black", fontSize: "1.5em", marginBottom: "1.5em" }}>Add Category</p>
        <TextField 
          hintText="Category title"
          value={this.state.category}
          style={{ width: "90%", marginLeft: "10px", marginRight: "10px", marginBottom: "1.5em" }}
          onKeyPress={this.onKeyPress}
          onChange={(event, value) => { this.setState({ category: value }); }}
        />
      </div>
      {rows}
    </Container>;
  }
}

export default connect(mapStateToProps)(CategoriesPage);