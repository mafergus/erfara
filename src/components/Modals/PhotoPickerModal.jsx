import React, { PropTypes } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Dropzone from "react-dropzone";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import CircularProgress from 'material-ui/CircularProgress';
import { Row, Col } from 'react-bootstrap';
import { erfaraBlack } from "utils/colors";
import { getPhotos, uploadFile, putEventPhoto } from "utils/Api";
import store from "store/store";
import "stylesheets/PhotoPickerModal.scss";

function mapStateToProps(state) {
  return {
    images: state.images,
  };
}

export class PhotoPickerModal extends React.Component { 

  static propTypes = {
    eventId: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      dropzoneActive: false,
      files: [],
      selectedPhoto: null,
      image: [],
      isUploading: false,
    };
  }

  onDrop(acceptedFiles) {
    this.setState({ dropzoneActive: false, selectedPhoto: { url: acceptedFiles[0].preview, isBlob: true }});
  }

  onImageSelected(image) {
    this.setState({ dropzoneActive: false, selectedPhoto: { url: image.webformatURL, isBlob: false }});
  }

  onDragEnter() {
    this.setState({ dropzoneActive: true });
  }

  onDragLeave() {
    this.setState({ dropzoneActive: false });
  }

  onCancel() {
    this.setState({ selectedPhoto: null });
  }

  getImages() {
    getPhotos(this.state.searchTerm).then(json => store.dispatch({ type: "GET_IMAGES_SUCCESS", images: json.hits }));
  }

  submitPhoto() {
    const { eventId } = this.props;
    const { selectedPhoto } = this.state;

    this.setState({ isUploading: true });

    fetch(selectedPhoto.url).then(response => {
      if (response && response.ok) {
        return response.blob();
      }
    })
    .then(blob => uploadFile(blob))
    .then(url => putEventPhoto(url, eventId))
    .then(() => {
      this.setState({ isUploading: false });
      this.requestClose();
    });
  }

  requestClose() {
    const { onRequestClose } = this.props;
    this.state = {
      dropzoneActive: false,
      files: [],
      selectedPhoto: null,
      image: [],
    };

    onRequestClose();
  }

  renderPhotos(images, preview) {
    let rowItems = [];
    const rows = [];
    images.forEach(image => {
      if (rowItems.length === 4) {
        rows.push(<Row key={rows.length}>{rowItems}</Row>);
        rowItems = [];
      }
      rowItems.push(<Col key={image.previewURL} lg={3}>
        <div
          className="image"
          onTouchTap={this.onImageSelected.bind(null, image)}
          style={{ backgroundImage: `url(${image.previewURL})` }}
        />
      </Col>);
    });
    if (rowItems.length) {
      rows.push(<Row key={rows.length}>{rowItems}</Row>);
    }
    return <div style={{ position: "relative" }}>
      <div style={{ overflowY: "scroll", width: "100%", height: 500, marginTop: 20, position: "relative" }}>
        {rows}
      </div>
      {this.renderPreview(preview)}
    </div>;
  }

  renderPreview(image) {
    if (!image) { return; }
    return <div className="preview-container">
      <img src={image.url} style={{ width: "100%", height: 300 }} />
      <div className="image-overlay" >
        <a
          href="#"
          onTouchTap={() => this.onCancel()}
          className="close-btn"
          style={{ textDecoration: "none" }}
        >
          &times;
        </a>
      </div>
    </div>;
  }

  render() {
    const { isOpen, images } = this.props;
    const { dropzoneActive, selectedPhoto, searchTerm } = this.state;
    let dropzoneRef;

    return <Dialog
      bodyStyle={{ marginTop: 15 }}
      contentStyle={{ width: "100%" }}
      modal={false}
      onRequestClose={this.requestClose}
      open={isOpen}
      title="Pick a photo (or drag and drop)"
      titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: erfaraBlack }}
      autoScrollBodyContent>
      <Dropzone
        style={{ width: "initial", height: "initial", border: "none" }}
        accept="image/*"
        ref={(node) => { dropzoneRef = node; }}
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        disableClick
      >
        { dropzoneActive && <div className="overlay">Drop files...</div> }
        <div className="border" style={{ width: 400, height: 45, display: "inline-block" }}>
          <TextField
            hintText="Search for a photo"
            style={{ paddingLeft: 11, width: "100%" }}
            underlineShow={false}
            onChange={(event) => { this.setState({ searchTerm: event.target.value }, this.getImages); }}
            value={searchTerm}
          />
        </div>
        <span style={{ color: erfaraBlack, margin: "0px 20px" }}>or</span>
        <RaisedButton 
          style={{ height: 45, width: 150 }}
          label="Upload Photo"
          onTouchTap={() => { dropzoneRef.open(); }}
        />
        {this.renderPhotos(images, selectedPhoto)}
        {selectedPhoto && <div className="button-container">
          {this.state.isUploading ? <CircularProgress /> : <RaisedButton
            style={{ height: 45, width: 150 }}
            label="Ok"
            onTouchTap={() => this.submitPhoto()}
            primary
          />}
        </div>}
      </Dropzone>
    </Dialog>;
  }
}

export default connect(mapStateToProps)(PhotoPickerModal);