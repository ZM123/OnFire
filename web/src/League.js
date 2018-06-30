import React, { Component } from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import './css/League.css';
import Team from './Team';

import baseballImage from './images/baseball.jpg';
import basketballImage from './images/basketball.jpg';
import footballImage from './images/football.jpg';
import hockeyImage from './images/hockey.jpg';
import worldcupImage from './images/soccer.jpg';

import { baseballTeams, basketballTeams, hockeyTeams, worldcupTeams } from './teams/teamNames';
import footballTeams from './teams/footballteams.json';

import teamColours from './colours/teamColours'

const leagueImages = {
    baseball: baseballImage,
    basketball: basketballImage,
    football: footballImage,
    hockey: hockeyImage,
    worldcup: worldcupImage
}

const teamObject = {
    baseball: baseballTeams,
    basketball: basketballTeams,
    football: Object.values(footballTeams),
    hockey: hockeyTeams,
    worldcup: worldcupTeams
}

class League extends Component {
    render() {
        return (
            <div className="League">
                <img src={leagueImages[this.props.match.params.sport]} alt="" className="LeagueBackground" />
                <Switch>
                    <Route path={`${this.props.match.path}/:team`} component={Team} />
                    <Route path={`${this.props.match.path}`} component={TeamList} />
                </Switch>
            </div>
        );
    }
}

class TeamList extends Component {
    render() {
        return (
            <div className="TeamsContainer">
                <Link to="/" className="HomeLink">OnFire</Link>
                <table>
                    <tbody>
                        {Object.keys(teamObject[this.props.match.params.sport]).sort().map(team =>
                            <TableRow
                                teamId={team}
                                team={teamObject[this.props.match.params.sport][team]}
                                link={`${this.props.match.url}/${team}`}
                                key={team}
                                />
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

class TableRow extends Component {
    render() {
        const colours = teamColours[this.props.teamId]
        const rowStyle = {
            position: 'relative'
            // backgroundColor: colours[noSpace(this.props.team)]['background-color']
        }
        const linkStyle = {
            color: colours['color'],
            backgroundColor: window.innerWidth > 768 ? 'none' : colours['background-color']
        }

        return (
            <tr style={rowStyle}>
                <td style={{position: 'relative'}}>
                    {window.innerWidth > 768 && <svg width="100%" height="100%" className="LinkBackground">
                        <rect width="100%" height="100%" style={{fill:`${colours['background-color']}`}} />
                    </svg>}
                    <Link
                        to={this.props.link}
                        key={this.props.teamId}
                        className="TeamLink"
                        style={linkStyle}
                        >
                        {this.props.team}
                    </Link>
                </td>
            </tr>
        )
    }
}

export default League;
