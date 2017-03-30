require('bootstrap/dist/css/bootstrap.css');
import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import firebase from "firebase";
import store from "store/store";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-bootstrap';
import { autoAddCategory, updateCategory, getPhotos, uploadFile, deleteCategory } from "utils/Api";

function mapStateToProps(state) {
  return {
    categories: state.categories,
    images: state.images,
  };
}

export class CategoriesPage extends React.Component {

  static propTypes = {
    categories: PropTypes.object,
    images: PropTypes.object,
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
      let categories = [];
      snapshot.forEach(child => {
        categories.push(child.val());
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
      });
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
    this.setState({ photoLoading: true });
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
    deleteCategory(category.id);
    this.setState({ categoryModalOpen: false });
  }

  renderModal() {
    const { images } = this.props;
    let rowItems = [];
    return <Dialog
      style={{ zIndex: 9000 }}
      modal={false}
      onRequestClose={() => this.setState({ photoDialogOpen: false })}
      open={this.state.photoDialogOpen}>
      <div style={{ overflowY: "scroll", width: "100%", height: 500 }}>
        {images.map(image => {
        if (rowItems.length == 8) {
          const leRow = <Row>{rowItems}</Row>;
          rowItems = [];
          return leRow;
        }
        rowItems.push(<Col lg={3}>
          <div onClick={this.updateCategoryImage.bind(null, image)} style={{ backgroundImage: `url(${image.previewURL})`, backgroundPosition: "50% 50%", backgroundSize: "cover", height: 200, width: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          </div>
        </Col>);
        })}
      </div>
    </Dialog>;
  }

  renderCategoryModal() {
    const category = this.state.selectedCategory;
    return <Dialog
      modal={false}
      onRequestClose={() => this.setState({ categoryModalOpen: false })}
      open={this.state.categoryModalOpen}>
      {this.state.photoLoading ? <CircularProgress /> :
       <div style={{ overflowY: "scroll", width: "100%", height: 500 }}>
        <img style={{ width: 640, height: 280 }} src={category && category.image}/>
        <RaisedButton onTouchTap={this.getImages} primary>Change Image</RaisedButton>
        <br/>
        <TextField 
          hintText="Name"
          defaultValue={category ? category.name : ""}
          onChange={(event, value) => { this.setState({ newName: value }) }}
          onKeyPress={this.updateCategoryName}
        />
        <br/>
        <RaisedButton onTouchTap={category => this.deleteCategory(category)} primary>Delete</RaisedButton>
      </div>}
    </Dialog>;
  }

  renderCategoryItem(key, category) {
    return <div onClick={() => this.setState({ categoryModalOpen: true, selectedCategory: { ...category, id: key }}) } className="hoverable" style={{ height: 200, width: 200, backgroundImage: `url(${category.image})`, backgroundPosition: "50% 50%", backgroundSize: "cover", backgroundBlendMode: "multiply", backgroundColor: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "white", fontSize: "1.4em" }}>{category.name}</p>
    </div>;
  }

  render() {
    const { categories } = this.props;
    if (!categories) { return null; }
    let rowItems = [];
    let rows = [];
    categories.forEach((category, key) => {
      if (rowItems.length == 4) {
        rows.push(<Row style={{ marginBottom: 15 }}>{rowItems}</Row>);
        rowItems = [];
      }
      rowItems.push(<Col lg={3}>
        {this.renderCategoryItem(key, category)}
      </Col>);
    });
    rows.push(<Row>{rowItems}</Row>);
    return <Grid>
      {this.renderModal()}
      {this.renderCategoryModal()}
      <div style={{ margin: "50px 0px" }}>
        <p style={{ color: "black", fontSize: "1.5em", marginBottom: "1.5em" }}>Add Category</p>
        <TextField 
          hintText="Category title"
          value={this.state.category}
          style={{ width: "90%", marginLeft: "10px", marginRight: "10px", marginBottom: "1.5em" }}
          onKeyPress={this.onKeyPress}
          onChange={ (event, value) => { this.setState({ category: value }) }}
        />
      </div>
      {rows}
    </Grid>;
  }
}

export default connect(mapStateToProps)(CategoriesPage);