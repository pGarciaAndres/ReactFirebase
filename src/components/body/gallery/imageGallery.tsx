import * as React from 'react';
import * as firebase from 'firebase';
import * as ReactModal from 'react-modal';
import { AdminLogin } from "../authentication";
import { ImageList } from './imageList';
import { AlbumManagement } from './albumManagement';
const albumSizeImg = require('../../../images/albumSizeImg.png');
const classNames = require('./imageGallery.css');

interface Props {
}

interface State {
    user: Object;
    albumList: any[];
    imagesAlbumSelected: any[];
}

export class ImageGallery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: null,
            albumList: [],
            imagesAlbumSelected: null,
        }
    }

    componentWillMount() {
        ReactModal.setAppElement('body');
        // Authentication
        firebase.auth().onAuthStateChanged((user: Object) => {
            this.setState({ user });
        });
        // Get album list from firebase
        this.getAlbumList();
    }

    getAlbumList = () => {
        let albumCollection = [];
        firebase.database().ref('gallery').on('child_added', snapshot => {
            const record = {
                name: snapshot.key,
                images: this.getImagesFromAlbum(snapshot.key),
            };
            albumCollection.push(record);
        });
        return setTimeout(() => {
            this.setState({
                albumList: albumCollection,
            });
        }, 1500);   
    }

    getImagesFromAlbum = (albumName) => {
        let imageCollection = [];
        firebase.database().ref(`gallery/${albumName}`).on('child_added', snapshot => {
            const record = {
                id: snapshot.val().id,
                name: snapshot.val().name,
                image: snapshot.val().image
            };
            imageCollection.push(record);
        });
        return imageCollection;
    }

    handleCreateAlbum = (event) => {
        if (event && event.currentTarget && event.currentTarget[2]) {
            const albumName = event.currentTarget[2].value;
            const record = {
                name: albumName,
                images: [],
            };
            this.setState({
                albumList: [record].concat(this.state.albumList),
            });

            // var file = new File([albumName], albumName+".png", {
            //     type: "image/png",
            // });
            // const storageRef = firebase.storage().ref(`gallery/${albumName}`);
            // const task = storageRef.put(file);
            // task.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
            //     let percentage = (task.snapshot.bytesTransferred /task.snapshot.totalBytes) * 100;
            // }, error => {
            //     console.log(error.message);
            // }, () => {
            //     const album = {
            //         albumName: task.snapshot.metadata.name
            //     };
            //     const dbRef = firebase.database().ref(`gallery/${albumName}`);
            //     const newAlbum = dbRef.push();
            //     newAlbum.set(album);
            // });
        }
    }

    public render() {
        return (
            <div className={classNames.imageGalleryContainer}>
                <div className={classNames.galleryToolsContainer}>
                    {this.state.user && <AlbumManagement onCreate={this.handleCreateAlbum}/> }
                    <AdminLogin />
                </div>
                {/* One each item from albumList */}
                {this.state.albumList.map(album => (
                    <div className={classNames.albumContainer} key={album.name}>
                        <div className={classNames.album} onClick={() => {this.setState({ imagesAlbumSelected : album.images })} }
                        style={{ backgroundImage: `url(${album.images[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat'}}>
                            <div className={classNames.darkLayer}>
                                <span className={classNames.darkLayerText}>VIEW ALL</span>
                            </div>
                            <div className={classNames.albumSummary}>
                                <span className={classNames.albumSize}>{album.images.length}</span>
                                <img className={classNames.albumSizeImg} src={albumSizeImg} alt="size" />
                            </div>
                        </div>
                        <span className={classNames.albumTitle}>{album.name}</span>
                    </div>
                ))}
                {this.state.imagesAlbumSelected && <ImageList user={this.state.user} albumImages={this.state.imagesAlbumSelected} /> }
            </div>
        );
    }
}