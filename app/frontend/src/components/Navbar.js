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
            {/* Logo a la izquierda */}
            <div className="logo-container">
                <img
                    src="https://web.muninqn.gov.ar/pluginfile.php/37/coursecat/description/logo-muni%20%283%29.png"
                    alt="Logo Municipalidad"
                    className="logo"
                />
            </div>

            {/* Botones agrupados */}
            <div className="nav-buttons">
                <Link className="nav-btn" to="/map">Mapa</Link>
                <Link className="nav-btn" to="/list">Lista</Link>
                <Link className="nav-btn" to="/add-poi">Agregar POI</Link>
                {role === 'admin' && <Link className="nav-btn" to="/admin">Administrar POIs</Link>}
                <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;
