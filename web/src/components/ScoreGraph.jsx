import classNames from 'classnames';
import React, { Component } from 'react';
import '../css/Team.css';

export default class ScoreGraph extends Component {
    calculateScoreArray(scoreMap) {
        const scoreArray = Object.keys(scoreMap).map(player => ({
            player,
            score: scoreMap[player].score,
            count: scoreMap[player].count
        }))
        return scoreArray.sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, this.props.numScores)
    }

    render() {
        return (
            <div className="ScoreGraph">
                {this.calculateScoreArray(this.props.scoreMap).map(scoreObj =>
                    <ScoreGraphItem
                        player={scoreObj.player}
                        score={scoreObj.score}
                        count={scoreObj.count}
                        key={scoreObj.player}
                        colour={this.props.teamColour}
                        scoreMap={!this.props.live && this.props.scoreMap}
                        />
                )}
            </div>
        )
    }
}

class ScoreGraphItem extends Component {
    render() {
        let width = `${Math.min(Math.abs(this.props.score)*2, 100)}%`
        if (this.props.scoreMap) {
            let sum = Object.values(this.props.scoreMap).reduce((a, b) => {
                return Math.abs(a) + Math.abs(parseInt(b.score, 10));
            }, 0)
            width = `${Math.min(100*(Math.abs(this.props.score)/(0.3*sum)), 100)}%`
        }

        return (
            <div className="ScoreGraphItem">
                <div className="PlayerName">
                    {this.props.player.toUpperCase()}
                </div>
                <svg width="100%" height="16px">
                    <rect
                        className={classNames("ScoreBar", {
                            positive: this.props.score > 0,
                            negative: this.props.score < 0
                        })}
                        style={{
                            width: width,
                            fill: `${this.props.score > 0 ? this.props.colour : '#bbbbbb'}`
                        }}
                        rx="8"
                        ry="8"
                        />
                </svg>
            </div>
        )
    }
}
