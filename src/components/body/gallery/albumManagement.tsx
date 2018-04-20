import * as React from 'react';
import * as firebase from 'firebase';
const classNames = require('./albumManagement.css');
const submitAlbumImg = require('../../../images/add-album.png');

interface Props {
    onCreate: (event) => void;
}

interface State {
    showNewAlbumButton: boolean;
    albumName: string;
}

export class AlbumManagement extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showNewAlbumButton: true,
            albumName: ''
        }
    }

    public render() {
        return (
            <div className={classNames.manageContainer}>
                <div className={classNames.manageButtons}>
                        <form onSubmit={this.props.onCreate}>
                            <input type="button" 
                                className={this.state.showNewAlbumButton ? "btn" : classNames.hidden} 
                                value="New Album" 
                                onClick={() => this.setState({ showNewAlbumButton : false }) }/>
                            <input type="button" 
                                className={this.state.showNewAlbumButton ? classNames.hidden : "btn"} 
                                value="Cancel" 
                                onClick={(e) => { this.setState({ albumName : "" }); this.setState({ showNewAlbumButton : true });} }/>
                            <input type="text" 
                                className={this.state.showNewAlbumButton ? classNames.hiddenText : "form-control"} 
                                value={this.state.albumName}
                                placeholder="Enter an album name" 
                                onChange={(e) => this.setState({ albumName : e.currentTarget.value })} 
                                onFocus={(e) => e.currentTarget.placeholder = ""} 
                                onBlur={(e) => e.currentTarget.placeholder = "Enter an album name"} />
                            <button type="submit" className={this.state.showNewAlbumButton ? classNames.hidden : "btn btn-success"} disabled={!this.state.albumName}>
                                <img className={classNames.submitAlbumImg} src={submitAlbumImg} alt="Create" />
                            </button>
                        </form>
                </div>
            </div>
        );
    }
}