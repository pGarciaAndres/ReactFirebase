import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            uploadValue: 0,
            picture: null
        };

        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(event) {
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
            })
        }, error => { 
            console.log(error.message);
        }, () => { //Image already uploaded.
            this.setState({
                uploadValue: 100,
                picture: task.snapshot.downloadURL
            });
        });
    }

    render() {
        return(
            <div>
                <p>Upload an image:</p>
                <progress value={this.state.uploadValue} max="100"></progress>
                <br/>
                <input type="file" onChange={this.handleUpload}/>
                <br/>
                <img width="320" src={this.state.picture} alt=""/>
            </div>
        );
    }
}

export default FileUpload;  