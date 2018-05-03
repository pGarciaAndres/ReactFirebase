import * as React from 'react';
import * as firebase from 'firebase';
import * as ReactModal from 'react-modal';
import { FileUpload } from './index';
import { PropagateLoader } from 'react-spinners';
const classNames = require('./imageList.css');
const addImage = require('../../../images/add-image.png');
const removeImage = require('../../../images/rm-image.png');

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
    user: Object,
    albumName: string,
    albumImages: any[],
    updateAlbum: () => void,
}

interface State {
    uploadValue: number;
    album: string;
    imageList: any[];
    openImage: string;
    loading: boolean;
}

export class ImageList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            uploadValue: 0,
            album: null,
            imageList: [],
            openImage: null,
            loading: true
        }
    }

    componentWillMount() {
        ReactModal.setAppElement('body');
        let nameCollection = this.props.albumName;
        let imageCollection = this.props.albumImages;
        this.setState({
            album: nameCollection,
            imageList: imageCollection,
            loading: false,
        });
    }

    componentWillReceiveProps(newProps) {
        let nameCollection = newProps.albumName;
        let imageCollection = newProps.albumImages;
        this.setState({
            album: nameCollection,
            imageList: imageCollection,
            loading: false,
        });
    }

    handleUploadImage = (event) => {
        if (event && event.currentTarget && event.currentTarget.files.length) {
            //Get the file from the event.
            const file = event.currentTarget.files[0];
            //Receive the reference.
            const storageRef = firebase.storage().ref(`/gallery/${this.state.album}/${file.name}`);
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
            }, () => {
                const record = {
                    id: task.snapshot.metadata.generation,
                    name: task.snapshot.metadata.name,
                    image: task.snapshot.downloadURL
                };

                const dbRef = firebase.database().ref(`gallery/${this.state.album}`);
                const newImage = dbRef.push();
                newImage.set(record);
                this.setState({
                    imageList: this.props.albumImages
                });
                this.props.updateAlbum();
            });
        }
    }

    openModalImage = () => {
        return (
            <ReactModal
                isOpen={this.state.openImage !== null}
                onRequestClose={() => this.setState({ openImage : null}) } onUpload={this.handleRemove}
                style={customStyles}
                contentLabel="Image Modal">
                <img className={classNames.imageZoom} src={this.state.openImage} alt="" />
                <img className={classNames.closeButton} src={addImage} alt="Close" onClick={() => this.setState({ openImage : null}) } />
                {this.props.user &&
                    <img className={classNames.removeButton} src={removeImage} alt="Eliminar" onClick={this.handleRemove} />
                }
            </ReactModal>
        );
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
                    imageList: this.state.imageList.filter(image => image.id !== file.id)
                });
            });
        }
    }

    public render() {
        if (this.state.imageList === null) {
            return  (
                <div className={classNames.imageListContainer}>
                    <h2>Select one album to load images.</h2>
                </div>
            )
        } else if (this.state.imageList.length === 0) {
            return  (
                <div className={classNames.imageListContainer}>
                    <h2>This album is empty.</h2>
                </div>
            )
        } else {
            return (
                <div className={classNames.imageListContainer}>
                    {this.props.user && this.state.loading === false &&
                        <FileUpload uploadValue={this.state.uploadValue} onUpload={this.handleUploadImage} />
                    }
                    {this.state.imageList.map(image => (
                        <img className={classNames.image} src={image.image} key={image.id} alt=""
                            onClick={(event) => this.setState({ openImage : event.currentTarget.src }) } />
                    )).reverse()}
                    <div className={classNames.loading}>
                        <PropagateLoader color={'#dddddd'} loading={this.state.loading} />
                    </div>
                    {this.openModalImage()}
                </div>
            )
        }
    }
}