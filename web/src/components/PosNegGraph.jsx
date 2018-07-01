import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';
import '../css/Team.css';

export default class PosNegGraph extends Component {
    render() {
        return (
            <div className="PosNegGraph">
                <Doughnut
                    data={{
                        labels: ['Positive', 'Negative'],
                        datasets: [{
                            data: [this.props.numPos, this.props.numNeg],
                            backgroundColor: [this.props.colour, '#bbbbbb']
                        }]
                    }}
                    options={{
                        maintainAspectRatio: false,
                    }}
                    legend={{
                        display: false,
                    }}
                    />
            </div>
        )
    }
}
