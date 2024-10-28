// frontend/src/pages/AdminPOIs.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPOIs = () => {
    const [pois, setPois] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllPOIs = async () => {
            try {
                const res = await axios.get('/api/pois/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const pendientes = res.data;
                setPois(pendientes);
            } catch (err) {
                setError('Error al obtener POIs');
            }
        };
        fetchAllPOIs();
    }, []);

    const approvePOI = async (id) => {
        try {
            await axios.post(`/api/pois/${id}/aprobar`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPois(pois.filter(poi => poi.id !== id));
        } catch (err) {
            setError('Error al aprobar POI');
        }
    };

    const rejectPOI = async (id) => {
        try {
            await axios.post(`/api/pois/${id}/rechazar`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPois(pois.filter(poi => poi.id !== id));
        } catch (err) {
            setError('Error al rechazar POI');
        }
    };

    return (
        <div className="admin-pois-container">
            <h2>Administrar POIs Pendientes</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {pois.map(poi => (
                    <li key={poi.id}>
                        <h3>{poi.nombre}</h3>
                        <p>{poi.descripcion}</p>
                        <p><strong>Categoría:</strong> {poi.categoria}</p>
                        <button onClick={() => approvePOI(poi.id)}>Aprobar</button>
                        <button onClick={() => rejectPOI(poi.id)}>Rechazar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPOIs;
