import React, { Component } from 'react';
import addImage from './add-image.png';
import './FileUpload.css';

class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            uploadValue: 0
        };
    }

    render() {
        return(
            <div className="upload-image">
                <label htmlFor="file-input">
                    <img className="add-image" src={ addImage } alt=""/>
                </label>
                <input id="file-input" type="file" onChange={ this.props.onUpload }/>
                {/* <progress className="progress-bar" value={this.state.uploadValue} max="100"></progress> */}
            </div>
        );
    }
}

export default FileUpload;  