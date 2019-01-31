import * as React from 'react';
import * as firebase from 'firebase';
import { PropagateLoader } from 'react-spinners';
const albumNoImg = require('../../../images/albumNoImg.png');
const albumSizeImg = require('../../../images/albumSizeImg.png');
const classNames = require('./albumList.css');

interface Props {
    albumList: any[],
    onSelectAlbum: (album) => void,
}

interface State {
    albumList: any[];
    loading: boolean;
}

export class AlbumList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            albumList: [],
            loading: true
        }
    }

    componentWillMount() {
        let albumCollection = this.props.albumList;
        this.setState({
            albumList: albumCollection,
            loading: false,
        });
    }

    componentWillReceiveProps(newProps) {
        let albumCollection = newProps.albumList;
        this.setState({
            albumList: albumCollection,
            loading: false,
        });
    }

    public render() {
        return (
            <div className={classNames.albumListContainer}>
                {this.state.albumList.map(album => (
                    <div className={classNames.albumContainer} key={album.name}>
                        <div className={classNames.album} onClick={() => this.props.onSelectAlbum(album)} 
                            style={{ backgroundImage: 'url(' + (album.images.length>0 ? album.images[album.images.length-1].image : albumNoImg) + ')', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
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
                <div className={classNames.loading}>
                    <PropagateLoader color={'#dddddd'} loading={this.state.loading} />
                </div>
            </div>
        )
    }
}