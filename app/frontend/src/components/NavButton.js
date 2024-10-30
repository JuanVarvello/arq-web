// NavButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavButton = ({ to, icon, children }) => (
    <Link className="nav-btn" to={to}>
        {icon && <img src={icon} alt="icon" className="nav-btn-icon" />}
        {children}
    </Link>
);

export default NavButton;
