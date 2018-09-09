import React, { Component } from 'react';
import '../css/IntroBox.css';

export default class IntroBox extends Component {
    render() {
        return (
            <div className="IntroBox">
                <div className="Title">OnFire</div>
                <div className="Body">
                    OnFire is a project that combines sports and social media data analysis.
                    <br />
                    Tweets related to sporting events and athletes are streamed and analyzed for positive and negative sentiment.
                    This data is then aggregated and displayed visually for specific teams or across all sports.
                    <br />
                    By clicking a sport at the top you can browse the teams available.
                    On each team page, the <span style={{fontWeight: 'bold'}}>LIVE</span> view shows tweets in real time and displays results weighted by recency.
                    The <span style={{fontWeight: 'bold'}}>DAILY</span> view lets you see which players were trending on dates in the past.
                    <br /><br />
                    For any questions please contact <a href="mailto:zalmachado@gmail.com">zalmachado@gmail.com</a>
                </div>
            </div>
        )
    }
}
