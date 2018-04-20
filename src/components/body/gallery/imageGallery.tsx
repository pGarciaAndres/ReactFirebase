import * as React from 'react';
import * as firebase from 'firebase';
import * as ReactModal from 'react-modal';
import { AdminLogin } from "../authentication";
import { Album } from './album';
import { AlbumManagement } from './albumManagement';
const classNames = require('./imageGallery.css');

interface Props {
}

interface State {
    user: Object;
    albums: any[];
}

export class ImageGallery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: null,
            albums: []
        }
    }

    componentWillMount() {
        ReactModal.setAppElement('body');
        firebase.auth().onAuthStateChanged((user: Object) => {
            this.setState({ user });
        });
    }

    handleCreateAlbum = (event) => {
        if (event && event.currentTarget && event.currentTarget[2]) {
            const albumName = event.currentTarget[2].value;
            var file = new File([albumName], albumName+".png", {
                type: "image/png",
            });
            const storageRef = firebase.storage().ref(`gallery/${albumName}`);
            const task = storageRef.put(file);
            task.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
                let percentage = (task.snapshot.bytesTransferred /task.snapshot.totalBytes) * 100;
            }, error => {
                console.log(error.message);
            }, () => {
                const album = {
                    albumName: task.snapshot.metadata.name
                };
                const dbRef = firebase.database().ref(`gallery/${albumName}`);
                const newAlbum = dbRef.push();
                newAlbum.set(album);
            });
        }
    }

    public render() {
        return (
            <div>
                <div className={classNames.galleryToolsContainer}>
                    {this.state.user && <AlbumManagement onCreate={this.handleCreateAlbum}/> }
                    <AdminLogin />
                </div>
                <div className={classNames.imageGalleryContainer}>
                    <Album user={this.state.user} />
                </div>
            </div>
        );
    }
}