import React, { Component } from 'react';
import '../css/Team.css';

export default class Legend extends Component {
    render() {
        return (
            <div className="Legend">
                <svg width="16" height="16">
                  <rect width="100%" height="100%" rx="4px" ry="4px" style={{ fill: this.props.colour }} />
                </svg>
                <span>Positive</span>
                <svg width="16" height="16">
                  <rect width="100%" height="100%" rx="4px" ry="4px" style={{ fill: '#bbbbbb' }} />
                </svg>
                <span>Negative</span>
            </div>
        )
    }
}
