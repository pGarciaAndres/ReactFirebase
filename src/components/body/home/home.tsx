import * as React from 'react';
const classNames = require('./home.css');

interface Props {
}

export const Home = (props : Props) => {
    return (
        <div>
            <div className={classNames.home}>
                <h2>Home</h2>
            </div>
        </div>
    );
}