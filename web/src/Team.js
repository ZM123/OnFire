import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { parse } from 'qs';
import './css/Team.css';

import teamColours from './colours/teamColours';
import LinkBar from './components/LinkBar';
import InfoCard from './components/InfoCard';


class Team extends Component {
    render() {
        const teamColour = teamColours[this.props.match.params.team]['background-color']

        return (
            <div className="Team">
                <div className="ColourBackground" style={{backgroundColor: teamColour}} />
                <LinkBar />
                <Switch>
                    <Route exact path={`${this.props.match.path}/live`} render={() => <InfoCard team={this.props.match.params.team} colour={teamColour} live />} />
                    <Route path={`${this.props.match.path}`} render={() => <InfoCard team={this.props.match.params.team} colour={teamColour} date={parse(this.props.location.search.substr(1)).date} />} />
                </Switch>
            </div>
        );
    }
}

export default Team;
