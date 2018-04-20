import * as React from 'react';
import * as firebase from 'firebase';
import * as ReactModal from 'react-modal';
import { FileUpload } from "./fileUpload";
import { PropagateLoader } from 'react-spinners';
const classNames = require('./album.css');
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
    album: Object,
}

interface State {
    uploadValue: number;
    imageList: any[];
    openImage: string;
    loading: boolean;
}

export class Album extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            uploadValue: 0,
            imageList: [],
            openImage: null,
            loading: true
        }
    }

    componentWillMount() {
        ReactModal.setAppElement('body');
        // this.getImageListByAlbum(this.props.album);
        let imageCollection = [];
        firebase.database().ref('images').on('child_added', snapshot => {
            const record = {
                id: snapshot.val().id,
                name: snapshot.val().name,
                image: snapshot.val().image
            };
            imageCollection.push(record);
        });
        return setTimeout(() => {
            this.setState({
                imageList: imageCollection,
                loading: false,
            });
        }, 1500);
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

                const prev = this.state.imageList.length;
                newImage.set(record);
                const post = this.state.imageList.length;
                if (post === prev) {
                    this.setState({
                        imageList: this.state.imageList.concat(record)
                    });
                }
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
        return (
            <div>
                {this.props.user && this.state.loading === false && 
                    <FileUpload uploadValue={this.state.uploadValue} onUpload={this.handleUpload} />
                }
                {this.state.imageList.map(image => (
                    <img className={classNames.image} src={image.image} key={image.id} alt=""
                        onClick={(event) => this.setState({ openImage : event.currentTarget.src }) } />
                )).reverse()}
                <div className={classNames.loading}>
                    <PropagateLoader color={'#dddddd'} loading={this.state.loading}  />
                </div>
                {this.openModalImage()}
            </div>
        )
    }

}