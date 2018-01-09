import React, { Component } from 'react';
import firebase from 'firebase';
import addImage from './add-image.png';
import './FileUpload.css';

class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            picture: null
        };

        this.handleUpload = this.handleUpload.bind(this);
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
                this.setState({ picture: task.snapshot.downloadURL});
            }, error => { 
                console.log(error.message);
            });
        }
    }

    showNewImage() {
        if (this.state.picture) {
            return (
                <img className="image-gallery" src={this.state.picture} alt=""/>
            );
        }
    }

    render() {
        return(
            <div className="upload-image">
                <br/>
                <br/>
                <label htmlFor="file-input">
                    <img className="add-image" src={addImage} alt=""/>
                </label>
                <input id="file-input" type="file" onChange={this.handleUpload}/>
                { this.showNewImage() }
            </div>
        );
    }
}

export default FileUpload;  