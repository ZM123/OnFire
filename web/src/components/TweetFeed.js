import React, { Component } from 'react';
import '../css/Team.css';

import Tweet from './Tweet';

export default class TweetFeed extends Component {
    render() {
        return (
            <div className="Tweets">
                {this.props.tweets.slice(0, this.props.numTweets).map(tweetInfo =>
                    <Tweet
                        tweetInfo={tweetInfo}
                        key={tweetInfo.tweetId}
                        colour={this.props.colour}
                        num={this.props.numTweets}
                        />
                )}
            </div>
        )
    }
}
