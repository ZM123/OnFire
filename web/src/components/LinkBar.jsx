import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/LinkBar.css';

export default class LinkBar extends Component {
    render() {
        return (
            <div className="LinkBar">
                <Link to="/hockey" className="BackLink SportsLink">HOCKEY</Link>
                <Link to="/football" className="BackLink SportsLink">FOOTBALL</Link>
                <Link to="/" className="BackLink">OnFire</Link>
                <Link to="/basketball" className="BackLink SportsLink">BASKETBALL</Link>
                <Link to="/baseball" className="BackLink SportsLink">BASEBALL</Link>
            </div>
        )
    }
}
