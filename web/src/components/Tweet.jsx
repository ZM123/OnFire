import Highlighter from 'react-highlight-words';
import decode from 'unescape';
import React, { Component } from 'react';
import '../css/Team.css';

export default class Tweet extends Component {
    render() {
        const {
            text,
            username,
            screenName,
            profilePic
        } = this.props.tweetInfo

        return (
            <div className="TweetBody" style={{height: `${100/this.props.num}%`}}>
                <div className="ProfilePictureContainer">
                    <img src={profilePic} className="ProfilePicture" alt="avatar" />
                </div>
                <div className="TweetTextInfo">
                    <div className="TweetNames">
                        <div className="Username">{username}</div>
                        <div className="ScreenName">{screenName ? `@${screenName}` : `/u/${username}`}</div>
                    </div>
                    <div className="TweetText">
                        <Highlighter
                            searchWords={['#[A-Za-z0-9]+', '@[A-Za-z0-9_]+']}
                            highlightStyle={{color: this.props.colour, backgroundColor: 'inherit', fontWeight: 'bold'}}
                            textToHighlight={decode(text)}
                            />
                    </div>
                </div>
            </div>
        )
    }
}
