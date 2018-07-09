import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { parse } from 'qs';
import './css/Team.css';

import teamColours from './colours/teamColours';
import LinkBar from './components/LinkBar';
import InfoCard from './components/InfoCard';


class Team extends Component {
    isValidTeam(team) {
        return teamColours[this.props.match.params.team]
    }

    render() {
        if (!this.isValidTeam(this.props.match.params.team)) {
            return (
                <div></div>
            );
        }
        
        const teamColour = teamColours[this.props.match.params.team]['background-color']

        return (
            <div className="Team">
                <div className="ColourBackground" style={{backgroundColor: teamColour}} />
                <LinkBar />
                <div className="ModeBar">
                    <NavLink to={`${this.props.match.url}/live`} style={{ color: teamColours[this.props.match.params.team]['color'] }} className="ModeLink" activeClassName="active" exact>LIVE</NavLink>
                    <NavLink to={`${this.props.match.url}`} style={{ color: teamColours[this.props.match.params.team]['color'] }} className="ModeLink" activeClassName="active" exact>DAILY</NavLink>
                </div>
                <Switch>
                    <Route exact path={`${this.props.match.path}/live`} render={() => <InfoCard team={this.props.match.params.team} colour={teamColour} live />} />
                    <Route path={`${this.props.match.path}`} render={() => <InfoCard team={this.props.match.params.team} colour={teamColour} date={parse(this.props.location.search.substr(1)).date} />} />
                </Switch>
            </div>
        );
    }
}

export default Team;
