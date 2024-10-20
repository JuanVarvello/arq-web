// frontend/src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';  // Enlace al archivo CSS

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/register', { username, password, role });
            setSuccess('Registro exitoso. Puedes iniciar sesión.');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response.data.message);
            setSuccess('');
        }
    };

    return (
        <div className="register-container">
            <img 
              src="https://web.muninqn.gov.ar/pluginfile.php/37/coursecat/description/logo-muni%20%283%29.png" 
              alt="Logo" 
              className="register-logo" 
            />
            <h2>Registrarse</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Usuario:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label>Rol:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit" className="register-button">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;
