import * as React from 'react';
const classNames = require('./footer.css');
const logo = require('../../images/logo.png');

interface Props {

}

export const Footer = (props : Props) => {
    return (
        <div>
            <footer className={classNames.footer}>
                <img src={logo} className={classNames.logo} alt="logo" />
                <span className={classNames.title}>React & Firebase</span>
            </footer>
        </div>
    );
}