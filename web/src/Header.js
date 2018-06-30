import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css';

class Header extends Component {
    render() {
        return (
            <div className="Header">
                <header>
                    <nav>
                        <ul className="NavList">
                            <li className="NavItem"><Link to='/' className="NavLink">Home</Link></li>
                            <li className="NavItem"><Link to='/baseball' className="NavLink">Baseball</Link></li>
                            <li className="NavItem"><Link to='/basketball' className="NavLink">Basketball</Link></li>
                            <li className="NavItem"><Link to='/hockey' className="NavLink">Hockey</Link></li>
                        </ul>
                    </nav>
                </header>
            </div>
        );
    }
}

export default Header;
