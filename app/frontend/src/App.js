// frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MapPage from './pages/MapPage';
import AddPOI from './pages/AddPOI';
import POIList from './pages/POIList';
import AdminPOIs from './pages/AdminPOIs';
import Navbar from './components/Navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    return (
        <Router>
            {isAuthenticated && <Navbar setAuth={setIsAuthenticated} role={role} />}
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/map" /> : <Login setAuth={setIsAuthenticated} setRole={setRole} />
                } />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/map" /> : <Register />
                } />
                <Route path="/map" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <MapPage />
                    </PrivateRoute>
                } />
                <Route path="/add-poi" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <AddPOI />
                    </PrivateRoute>
                } />
                <Route path="/list" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <POIList />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute isAuthenticated={isAuthenticated} role={role}>
                        {role === 'admin' ? <AdminPOIs /> : <Navigate to="/map" />}
                    </PrivateRoute>
                } />
                <Route path="/" element={
                    <Navigate to={isAuthenticated ? "/map" : "/login"} />
                } />
                {/* Ruta para manejar 404 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

// Componente para rutas protegidas
const PrivateRoute = ({ children, isAuthenticated, role }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
