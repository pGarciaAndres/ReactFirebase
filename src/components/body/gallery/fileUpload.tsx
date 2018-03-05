import * as React from 'react';
const addImage = require('../../../images/add-image.png');
const classNames = require('./fileUpload.css');

interface Props {
    uploadValue: number;
    onUpload: (event) => void;
}

export class FileUpload  extends React.Component<Props> {

    renderProgressBar() {
        if (this.props.uploadValue > 0 && this.props.uploadValue < 100) {
            return (
                <progress className={classNames.progressBar} value={this.props.uploadValue} max="100"></progress>
            );
        }
    }

    public render() {
        return (
            <div className={classNames.uploadImage}>
                <label htmlFor="file-input">
                    <img className={classNames.addImage} src={addImage} alt="" />
                </label>
                <input id="file-input" type="file" onChange={this.props.onUpload} onClick={(event) => { event.currentTarget.value = null }} />
                {this.renderProgressBar()}
            </div>
        );
    }
}