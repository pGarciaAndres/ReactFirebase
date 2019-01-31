import * as React from 'react';
import * as firebase from 'firebase';
import * as ReactModal from 'react-modal';
import { AdminLogin } from "../authentication";
import { AlbumManagement, AlbumList, ImageList} from './index';
import { PropagateLoader } from 'react-spinners';
const classNames = require('./imageGallery.css');

interface Props {
}

interface State {
    user: Object;
    albumList: any[];
    nameAlbumSelected: string;
    imagesAlbumSelected: any[];
    loading: boolean;
}

export class ImageGallery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: null,
            albumList: [],
            nameAlbumSelected: null,
            imagesAlbumSelected: null,
            loading: true,
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
                loading: false,
            });
        }, 1500);
    }

    getImagesFromAlbum = (albumName: string) => {
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
                nameAlbumSelected: record.name,
                imagesAlbumSelected: record.images,
            });
        }
    }

    updateAlbum = (update) => {
        this.state.albumList.find(image => image.name === this.state.nameAlbumSelected).images = update;
        this.setState({
            albumList: this.state.albumList,
            imagesAlbumSelected: update,
        })
    }

    public render() {
        return (
            <div className={classNames.imageGalleryContainer}>
                <div className={classNames.galleryToolsContainer}>
                    {this.state.user && <AlbumManagement onCreate={this.handleCreateAlbum} />}
                    <AdminLogin />
                </div>
                {this.state.loading === false &&
                    <AlbumList albumList={this.state.albumList} onSelectAlbum={(album) => this.setState({nameAlbumSelected: album.name, imagesAlbumSelected: album.images})} />
                }
                {this.state.loading === false &&
                    <ImageList user={this.state.user} numberAlbums={this.state.albumList.length} albumName={this.state.nameAlbumSelected} albumImages={this.state.imagesAlbumSelected} updateAlbum={(update) => this.updateAlbum(update)} />
                }
            </div>
        )
    }
}