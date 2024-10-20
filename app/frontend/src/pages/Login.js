import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth, setRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            setAuth(true);
            setRole(res.data.role);
            navigate('/map');
        } catch (err) {
            setError(err.response.data.message || 'Error en el inicio de sesión');
        }
    };

    return (
        <div className="login-container">
            <img 
                src="https://web.muninqn.gov.ar/pluginfile.php/37/coursecat/description/logo-muni%20%283%29.png" 
                alt="Logo" 
                className="logo"
            />
            <h2>INICIAR SESIÓN</h2>
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    className="input" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    className="input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                {error && <p className="error">{error}</p>}
                
                <button type="submit" className="button">Iniciar Sesión</button>
            </form>
            
            <p className="register">
                ¿Es tu primera vez? <span onClick={() => navigate('/register')} className="register-link">Regístrate</span>
            </p>
        </div>
    );
};

export default Login;

