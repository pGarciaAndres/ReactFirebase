import React from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import AdminLogin from '../authentication/AdminLogin';
import Modal from 'react-modal';
import './ImageGallery.css';
import addImage from '../../images/add-image.png';
import removeImage from '../../images/remove-image.png';

const customStyles = {
    content : {
        position    : 'absolute',
        top         : '50%',
        right       : 'auto',
        bottom      : 'auto',
        left        : '50%',
        transform   : 'translate(-50%, -50%)',
        background  : 'none',
        border      : 'none',
        overflow    : 'visible'
    }
};

export default class ImageGallery extends React.Component {
    constructor() {
        super();

        this.state = {
            uploadValue: 0,
            images: [],
            openImage: null
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.openModalImage = this.openModalImage.bind(this);
        this.openImage = this.openImage.bind(this);
        this.closeImage = this.closeImage.bind(this);
    }

    componentWillMount() {
        Modal.setAppElement('body');
        firebase.database().ref('images').on('child_added', snapshot => {
            this.setState({
                images: this.state.images.concat(snapshot.val())
            });
        });
    }

    renderFileUploadButton() {
        if (this.props.user) {
            return (
                <FileUpload uploadValue={ this.state.uploadValue } onUpload={ this.handleUpload } />
            );
        }
    }

    handleUpload(event) {
        if (event && event.target && event.target.files.length) {
            //Get the file from the event.
            const file = event.target.files[0];
            //Receive the reference.
            const storageRef = firebase.storage().ref(`/images/${file.name}`);
            //Task to upload the file to Firebase.
            const task = storageRef.put(file);
            //Firebase utility to receive the file status.
            task.on('state_changed', snapshot => {
                let percentage = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
                this.setState({
                    uploadValue: percentage
                });
            }, error => {
                console.log(error.message);
            }, () => { //Image already uploaded.
                const record = {
                    id: task.snapshot.metadata.generation,
                    name: task.snapshot.metadata.name,
                    image: task.snapshot.downloadURL
                };
    
                const dbRef = firebase.database().ref('images');
                const newImage = dbRef.push();
                // newImage.set(record);

                //Chapuza - After login and upload an image don't refresh image list, but the image is uploaded.
                const prev = this.state.images.length;
                newImage.set(record);
                const post = this.state.images.length;
                if (post === prev) {
                    this.setState({
                        images: this.state.images.concat(record)
                    });
                }
                //end Chapuza
            });
        }
    }

    openModalImage() {
        if (this.props.user) {
            return (
                <Modal 
                isOpen={ this.state.openImage!==null }
                onRequestClose={ this.closeImage } onUpload={ this.handleRemove }
                style={ customStyles }
                contentLabel="Image Modal">
                  <img className="image-zoom" src={ this.state.openImage } alt="" />
                  <img className="close-button" src={ addImage } alt="Close" onClick={ this.closeImage } />
                  <img className="remove-button" src={ removeImage } alt="Eliminar" onClick={ this.handleRemove } />
              </Modal>
            );
        } else {
            return (
                <Modal 
                isOpen={ this.state.openImage!==null }
                onRequestClose={ this.closeImage } onUpload={ this.handleRemove }
                style={ customStyles }
                contentLabel="Image Modal">
                  <img className="image-zoom" src={ this.state.openImage } alt="" />
                  <img className="close-button" src={ addImage } alt="Close" onClick={ this.closeImage } />
              </Modal>
            );
        }
    }

    openImage(event) {
        this.setState({ openImage: event.target.src });
    }

    closeImage() {
        this.setState({ openImage: null });
    }

    handleRemove() {
        if (this.state.openImage) {
            var file = null;
            const src = this.state.openImage;
            const dbRef = firebase.database().ref('images');
            dbRef.orderByChild('image').equalTo(src).on('child_added', snapshot => {
                file = snapshot.val();
                snapshot.ref.remove();
                this.setState({
                    openImage: null,
                    images: this.state.images.filter(image => image.id !== file.id)
                });
            });
        }
    }

    render() {
        return(
            <div className="image-gallery">
                <AdminLogin user={ this.props.user } />
                { this.renderFileUploadButton() }
                { this.state.images.map(image => ( 
                    <img className="image" src={ image.image } key={ image.id } alt="" 
                    onClick={ this.openImage } />
                  )).reverse() }
                { this.openModalImage() }
            </div>
        );
    }
}
