import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './ImageGallery.css';

class ImageGallery extends Component {
    constructor() {
        super();

        this.state = {
            uploadValue: 0,
            images: [] 
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentWillMount() {
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
        if (event.target.files.length) {
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
                newImage.set(record);
            });
        }
    }

    handleRemove(event) {
        if (event.target) {
            var file = null;
            const src = event.target.src;
            const dbRef = firebase.database().ref('images');
            dbRef.orderByChild('image').equalTo(src).on('child_added', snapshot => {
                file = snapshot.val();
                snapshot.ref.remove();
            });
            
            this.setState({
                images: this.state.images.filter(image => image.id !== file.id)
            });
        }
    }

    render() {
        return(
            <div className="image-gallery">
                { this.renderFileUploadButton() }
                { this.state.images.map(image => ( 
                    <img className="image" src={ image.image } key={ image.id } alt="" onClick={ this.handleRemove } /> 
                  )).reverse() }
            </div>

        );
    }
}

export default ImageGallery;