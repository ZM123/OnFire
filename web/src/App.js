import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import logo from './logo.svg';
import './css/App.css';
import League from './League';
import Home from './Home';
// import Header from './Header';

class App extends Component {
    render() {
        return (
            <div className="App">
                <main>
                    <Route path='/' exact component={Home} />
                    <Route path='/:sport' component={League} />
                </main>
            </div>
        );
    }
}

export default App;
