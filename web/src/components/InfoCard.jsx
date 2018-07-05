import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Calendar from 'react-calendar';
import io from 'socket.io-client';
import '../css/Team.css';
import '../css/Calendar.css';

import teamNames from '../teams/teamNames';
import Legend from './Legend';
import ScoreGraph from './ScoreGraph';
import TweetFeed from './TweetFeed';
import PosNegGraph from './PosNegGraph';

let socket;

class InfoCard extends Component {
    constructor() {
        super();
        this.state = {
            tweets: [],
            scores: [],
            scoreMap: {},
            scoreBreakdown: {},
            loaded: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.date && this.props.date !== prevProps.date) {
            this.clearState()
            this.getHistoricScores(this.props.date)
        }
        if (!this.props.date && this.props.date !== prevProps.date) {
            this.clearState()
            this.getTodayScores()
        }
        if (this.props.live && this.props.live !== prevProps.live) {
            this.clearState()
            this.getLiveScores()
        }
        if (!this.props.live && this.props.live !== prevProps.live) {
            if (socket) socket.removeAllListeners('tweet')
        }
    }

    clearState() {
        this.setState({
            tweets: [],
            scores: [],
            scoreMap: {},
            scoreBreakdown: {},
            loaded: false
        })
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

    calculateScoreBreakdown(scores) {
        return {
            positive: this.state.scores.filter(s => s.score >= 0).length,
            negative: this.state.scores.filter(s => s.score < 0).length
        }
    }

    getLiveScores() {
        fetch('/recent/' + this.props.team)
            .then((response) => {
                return response.json();
            })
            .then((scores) => {
                this.setState({
                    scores: scores,
                    scoreMap: this.calculateScoreMap(scores),
                    scoreBreakdown: this.calculateScoreBreakdown(scores),
                    loaded: true
                })
            })
            .then(() => {
                socket = io();
                socket.on('tweet', ({ team, tweetInfo, player, score }) => {
                    if (this.props.team === team) {
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
                            scoreMap: this.calculateScoreMap(this.state.scores),
                            scoreBreakdown: this.calculateScoreBreakdown(this.state.scores)
                        })
                    }
                })
            });
    }

    getTodayScores() {
        console.log('today!')
    }

    getHistoricScores(date) {
        console.log(date)
    }

    setDate(date) {
        this.props.history.push('?date=' + date.toISOString().substr(0, 10));
    }

    isValidDate(date) {
        return date;
        // FIX THIS
    }

    componentDidMount() {
        if (this.props.live) {
            this.getLiveScores()
        } else {
            if (this.props.date) {
                this.getHistoricScores(this.props.date)
            } else {
                this.getTodayScores()
            }
        }
    }

    componentWillUnmount() {
        if (socket) socket.removeAllListeners('tweet')
        // redditsocket.removeAllListeners('tweet')
    }

    render() {
        const numScores = window.innerWidth > 768 ? Math.floor(window.innerHeight/180) : 5
        const numTweets = window.innerWidth > 768 ? Math.floor(window.innerHeight/110) : 8
        let date = new Date();
        if (this.isValidDate(this.props.date)) {
            date = new Date(this.props.date.split('-')[0], this.props.date.split('-')[1] - 1, this.props.date.split('-')[2])
        }

        return (
            <div className="InfoCard">
                <div className="ChartBox">
                    <span className="TeamName" style={{color: this.props.colour}}>
                        {teamNames[this.props.team].toUpperCase()}
                    </span>
                    <span className="Header">Sentiment</span>
                    <Legend colour={this.props.colour} />
                    {<ScoreGraph
                        scoreMap={this.state.scoreMap}
                        teamColour={this.props.colour}
                        numScores={numScores}
                        />}
                    <span className="Header">Positivity</span>
                    {<PosNegGraph
                        numPos={this.state.scoreBreakdown.positive}
                        numNeg={this.state.scoreBreakdown.negative}
                        colour={this.props.colour}
                        />}
                </div>
                {this.props.live && <TweetFeed tweets={this.state.tweets} numTweets={numTweets} colour={this.props.colour} />}
                {!this.props.live && <Calendar value={date} onChange={(date) => this.setDate(date)}/>}
            </div>
        )
    }
}

export default withRouter(InfoCard)
