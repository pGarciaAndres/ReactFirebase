import * as React from 'react';
import { Navigation } from './index';
const classNames = require('./header.css');
const logo = require('../../images/logo.png');

interface Props {

}

export const Header = (props : Props) => {
    return (
        <div>
            <header className={classNames.header}>
                <img src={logo} className={classNames.logo} alt="logo" />
                <h1 className={classNames.title}>React & Firebase</h1>
            </header>
            <Navigation />
        </div>
    );
}