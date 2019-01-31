import * as React from 'react';
import { Link } from 'react-router';
import * as Router from 'react-router-dom';
const classNames = require('./navigation.css');

interface Props {

}

export const Navigation = () => {
    return (
        <div>
            <ul>
                <li><Link to="/" onlyActiveOnIndex activeClassName={classNames.active}>Home</Link></li>
                <li><Link to="/news" activeClassName={classNames.active}>News</Link></li>
                <li><Link to="/gallery" activeClassName={classNames.active}>Gallery</Link></li>
                <li><Link to="/contact" activeClassName={classNames.active}>Contact</Link></li>
                <li className={classNames.right}><Link to="/about" activeClassName={classNames.active}>About</Link></li>
            </ul>
        </div>
    );
}   