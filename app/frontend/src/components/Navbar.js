// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import NavButton from './NavButton';

const Navbar = ({ setAuth, role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            {/* Logo on the left */}
            <div className="logo-container">
                <img
                    src="https://web.muninqn.gov.ar/pluginfile.php/37/coursecat/description/logo-muni%20%283%29.png"
                    alt="Logo Municipalidad"
                    className="logo"
                />
            </div>

            {/* Grouped buttons */}
            <div className="nav-buttons">
                <NavButton to="/map" icon={require('../components/map.png')}>Mapa</NavButton>
                <NavButton to="/list" icon={require('../components/list.png')}>Lista</NavButton>
                <NavButton to="/add-poi" icon={require('../components/plus-sign.png')}>Agregar POI</NavButton>
                {role === 'admin' && <NavButton to="/admin">Administrar POIs</NavButton>}
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;
