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
            dates: [],
            loaded: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.date !== prevProps.date) {
            this.clearState()
            if (this.props.date) {
                this.getHistoricScores(this.props.date)
            } else {
                this.getTodayScores()
            }
        }
        if (this.props.live !== prevProps.live) {
            this.clearState()
            if (this.props.live) {
                this.getLiveScores()
            } else {
                this.getAllowedDates()
                if (socket) socket.removeAllListeners('tweet')
                if (this.props.date) {
                    this.getHistoricScores(this.props.date)
                } else {
                    this.getTodayScores()
                }
            }
        }
    }

    clearState() {
        this.setState({
            tweets: [],
            scores: [],
            scoreMap: {},
            scoreBreakdown: {},
            dates: [],
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
            positive: scores.filter(s => s.score >= 0).length,
            negative: scores.filter(s => s.score < 0).length
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

    getAllowedDates() {
        fetch('/dates/' + this.props.team)
            .then((response) => {
                if (response.ok) return response.json();
                return Promise.resolve([])
            })
            .then((dates) => {
                this.setState({
                    dates: dates
                })
            })
    }

    getTodayScores() {
        fetch('/scores/' + this.props.team + '/today')
            .then((response) => {
                if (response.ok) return response.json();
                return Promise.resolve([])
            })
            .then(({ scoreMap, positive, negative }) => {
                Object.keys(scoreMap).forEach(player => {
                    scoreMap[player] = { score: scoreMap[player] }
                })
                this.setState({
                    scores: [],
                    scoreMap: scoreMap,
                    scoreBreakdown: { positive, negative },
                    loaded: true
                })
            })
    }

    getHistoricScores(date) {
        console.log(date)
    }

    setDate(date) {
        this.props.history.push('?date=' + date.toISOString().substr(0, 10));
    }

    shouldDisableDate(date, currDate, allowedDates) {
        const dateString = date.toISOString().substr(0, 10)
        console.log(dateString, currDate.toISOString().substr(0, 10))
        if (dateString === currDate.toISOString().substr(0, 10)) return false;
        return !allowedDates.includes(dateString)
    }

    isValidDate(date) {
        return date;
        // FIX THIS
    }

    componentDidMount() {
        if (this.props.live) {
            this.getLiveScores()
        } else {
            this.getAllowedDates()
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
        let currDate = new Date();
        currDate = new Date(Date.UTC(currDate.getUTCFullYear(), currDate.getUTCMonth(), currDate.getUTCDate(), currDate.getUTCHours() - 9))
        if (this.isValidDate(this.props.date)) {
            currDate = new Date(this.props.date.split('-')[0], this.props.date.split('-')[1] - 1, this.props.date.split('-')[2])
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
                        live={this.props.live}
                        />}
                    <span className="Header">Positivity</span>
                    {<PosNegGraph
                        numPos={this.state.scoreBreakdown.positive}
                        numNeg={this.state.scoreBreakdown.negative}
                        colour={this.props.colour}
                        />}
                </div>
                {this.props.live && <TweetFeed tweets={this.state.tweets} numTweets={numTweets} colour={this.props.colour} />}
                {!this.props.live && <Calendar tileDisabled={({date}) => this.shouldDisableDate(date, currDate, this.state.dates)} value={currDate} onChange={(date) => this.setDate(date)}/>}
            </div>
        )
    }
}

export default withRouter(InfoCard)
