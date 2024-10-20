import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

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
            <div className="nav-buttons">
                <Link className="nav-btn" to="/map">Mapa</Link>
                <Link className="nav-btn" to="/list">Lista</Link>
                <Link className="nav-btn" to="/add-poi">Agregar POI</Link>
                {role === 'admin' && <Link className="nav-btn" to="/admin">Administrar POIs</Link>}
            </div>
            <div className="logout">
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;

