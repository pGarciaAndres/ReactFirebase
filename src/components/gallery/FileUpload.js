import React from 'react';
import addImage from '../../images/add-image.png';
const classNames = require('./FileUpload.css');

export default class FileUpload extends React.Component {
    constructor() {
        super();

        this.renderProgressBar = this.renderProgressBar.bind(this);
    }

    renderProgressBar() {
        if (this.props.uploadValue > 0 && this.props.uploadValue < 100 ) {
            return(
                <progress className={classNames.progressBar} value={this.props.uploadValue} max="100"></progress>
            );
        }
    }

    readImage(event) {
        this.props.onUpload(event);
    }

    render() {
        return(
            <div className={classNames.uploadImage}>
                <label htmlFor="file-input">
                    <img className={classNames.addImage} src={ addImage } alt=""/>
                </label>
                <input id="file-input" type="file" onChange={ this.props.onUpload } onClick={(event)=> { event.target.value = null }}/>
                { this.renderProgressBar() }
            </div>
        );
    }
}