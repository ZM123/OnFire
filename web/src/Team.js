import React, { Component } from 'react';
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
                <InfoCard team={this.props.match.params.team} colour={teamColour} live />
            </div>
        );
    }
}

export default Team;
