import * as React from 'react';
import * as firebase from 'firebase';
import * as ReactModal from 'react-modal';
import { FileUpload } from "./fileUpload";
import { AdminLogin } from "../authentication/adminLogin";
const classNames = require('./ImageGallery.css');
const addImage = require('../../images/add-image.png');
const removeImage = require('../../images/rm-image.png');

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        right: 'auto',
        bottom: 'auto',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'none',
        border: 'none',
        overflow: 'visible'
    }
};

interface Props {
    user: Object
}

interface State {
    uploadValue: number;
    images: any[];
    openImage: string;
}

export class ImageGallery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            uploadValue: 0,
            images: [],
            openImage: null,
        }
    }

    componentWillMount() {
        ReactModal.setAppElement('body');
        firebase.database().ref('images').on('child_added', snapshot => {
            this.setState({
                images: this.state.images.concat(snapshot.val())
            });
        });
    }

    renderFileUploadButton = () => {
        if (this.props.user) {
            return (
                <FileUpload uploadValue={this.state.uploadValue} onUpload={this.handleUpload} />
            );
        }
    }

    handleUpload = (event) => {
        if (event && event.currentTarget && event.currentTarget.files.length) {
            //Get the file from the event.
            const file = event.currentTarget.files[0];
            //Receive the reference.
            const storageRef = firebase.storage().ref(`/images/${file.name}`);
            //Task to upload the file to Firebase.
            const task = storageRef.put(file);
            //Firebase utility to receive the file status.
            task.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
                let percentage = (task.snapshot.bytesTransferred /task.snapshot.totalBytes) * 100;
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

                const prev = this.state.images.length;
                newImage.set(record);
                const post = this.state.images.length;
                if (post === prev) {
                    this.setState({
                        images: this.state.images.concat(record)
                    });
                }
            });
        }
    }

    openModalImage = () => {
        if (this.props.user) {
            return (
                <ReactModal
                    isOpen={this.state.openImage !== null}
                    onRequestClose={() => this.setState({ openImage : null}) } onUpload={this.handleRemove}
                    style={customStyles}
                    contentLabel="Image Modal">
                    <img className={classNames.imageZoom} src={this.state.openImage} alt="" />
                    <img className={classNames.closeButton} src={addImage} alt="Close" onClick={() => this.setState({ openImage : null}) } />
                    <img className={classNames.removeButton} src={removeImage} alt="Eliminar" onClick={this.handleRemove} />
                </ReactModal>
            );
        } else {
            return (
                <ReactModal
                    isOpen={this.state.openImage !== null}
                    onRequestClose={() => this.setState({ openImage : null}) } onUpload={this.handleRemove}
                    style={customStyles}
                    contentLabel="Image Modal">
                    <img className={classNames.imageZoom} src={this.state.openImage} alt="" />
                    <img className={classNames.closeButton} src={addImage} alt="Close" onClick={() => this.setState({ openImage : null}) } />
                </ReactModal>
            );
        }
    }

    handleRemove = () => {
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

    public render() {
        return (
            <div>
                <AdminLogin user={this.props.user} />
                <div>
                    {this.renderFileUploadButton()}
                    {this.state.images.map(image => (
                        <img className={classNames.image} src={image.image} key={image.id} alt=""
                            onClick={(event) => this.setState({ openImage : event.currentTarget.src }) } />
                    )).reverse()}
                    {this.openModalImage()}
                </div>
            </div>
        );
    }
}
