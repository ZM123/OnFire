import React, { Component } from 'react';
import io from 'socket.io-client';
import './css/Home.css';

import ScoreGraph from './components/ScoreGraph';
import LinkBar from './components/LinkBar';
import homeimages from './images/homeimages';

let socket;
let background;

class Home extends Component {
    constructor() {
        super();
        this.state = {
            tweets: [],
            scores: [],
            scoreArray: []
        };

        background = homeimages[Math.floor(Math.random()*homeimages.length)]
        // getInitialData(param)
    }

    calculateScoreArray(scores) {
        let scoreMap = {}
        scores.forEach(score => {
            scoreMap[score.player] = {
                score: scoreMap[score.player] ? scoreMap[score.player].score + score.score : score.score,
                count: scoreMap[score.player] ? scoreMap[score.player].count + 1 : 1
            }
        })
        const scoreArray = Object.keys(scoreMap).map(player => ({
            player,
            score: scoreMap[player].score,
            count: scoreMap[player].count
        }))
        return scoreArray
    }

    componentDidMount() {
        socket = io();
        socket.on('tweet', ({ team, tweetInfo, player, score }) => {
            const tweets = this.state.tweets
            if (!tweets.some(t => t.tweetId === tweetInfo.tweetId)) {
              tweets.unshift(tweetInfo)
              if (tweets.length > 8) tweets.pop()
            }

            const scores = this.state.scores
            scores.unshift({ player, score })
            if (scores.length > 200) scores.pop()

            this.setState({
                tweets: tweets,
                scores: scores,
                scoreArray: this.calculateScoreArray(scores)
            })
        })

        // fetch('helloworld')
        //   .then((response) => {
        //     return response.json();
        //   })
        //   .then((myJson) => {
        //     console.log(myJson);
        //     this.setState({
        //         ...this.state,
        //         scoreArray: myJson
        //     })
        //   });
    }

    componentWillUnmount() {
        socket.removeAllListeners('tweet')
    }

    render() {
        return (
            <div className="Home">
                <LinkBar />
                <img src={background} alt="Home" className="HomeImage" />
                <div className="Graph">
                    <ScoreGraph
                        scoreArray={this.state.scoreArray.sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 11)}
                        teamColour={'black'}
                        />
                </div>
            </div>
        );
    }
}

export default Home;
