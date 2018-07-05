import React, { Component } from 'react';
import io from 'socket.io-client';
import '../css/Home.css';

import ScoreGraph from './ScoreGraph';

let socket;

export default class InfoCard extends Component {
    constructor() {
        super();
        this.state = {
            scores: [],
            scoreMap: {},
            loaded: false
        };
    }

    calculateScoreMap(scores) {
        const scoreMap = {}
        scores.forEach(score => {
            scoreMap[score.player] = {
                score: scoreMap[score.player] ? scoreMap[score.player].score + score.score : score.score,
                count: scoreMap[score.player] ? scoreMap[score.player].count + 1 : 1
            }
        })
        return scoreMap
    }

    componentDidMount() {
        fetch('/recent/all')
            .then((response) => {
                if (response.ok) return response.json();
                return Promise.resolve([]);
            })
            .then((scores) => {
                this.setState({
                    scores: scores,
                    scoreMap: this.calculateScoreMap(scores),
                    loaded: true
                })
            })
            .then(() => {
                socket = io();
                socket.on('tweet', ({ team, tweetInfo, player, score }) => {
                    const scores = this.state.scores
                    scores.unshift({ player, score })
                    if (scores.length > 200) scores.pop()

                    this.setState({
                        scores: scores,
                        scoreMap: this.calculateScoreMap(this.state.scores)
                    })
                })
            });
        // redditsocket.on('tweet', ({ team, tweetInfo, player, score }) => {
        //     if (this.props.match.params.team === team) {
        //         const tweets = this.state.tweets
        //         if (!tweets.some(t => t.tweetId === tweetInfo.tweetId)) {
        //           tweets.unshift(tweetInfo)
        //           if (tweets.length > 8) tweets.pop()
        //         }
        //
        //         const scores = this.state.scores
        //         scores.unshift({ player, score })
        //         if (scores.length > 200) scores.pop()
        //
        //         this.setState({
        //             tweets: tweets,
        //             scores: scores,
        //             scoreArray: this.calculateScoreArray(scores)
        //         })
        //     }
        // })
    }

    componentWillUnmount() {
        socket.removeAllListeners('tweet')
        // redditsocket.removeAllListeners('tweet')
    }

    render() {
        const numScores = window.innerWidth > 768 ? Math.floor(window.innerHeight/80) : 11

        return (
            <div>
                {this.state.loaded && <div className="Graph">
                    <ScoreGraph
                        scoreMap={this.state.scoreMap}
                        teamColour={'black'}
                        numScores={numScores}
                        />
                </div>}
            </div>
        )
    }
}
