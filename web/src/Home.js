import React, { Component } from 'react';
import './css/Home.css';

import HomeGraph from './components/HomeGraph';
import LinkBar from './components/LinkBar';
import homeimages from './images/homeimages';

let background;

class Home extends Component {
    constructor() {
        super();

        background = homeimages[Math.floor(Math.random()*homeimages.length)]
    }

    render() {
        return (
            <div className="Home">
                <LinkBar />
                <img src={background} alt="Home" className="HomeImage" />
                <HomeGraph />
            </div>
        );
    }
}

export default Home;
