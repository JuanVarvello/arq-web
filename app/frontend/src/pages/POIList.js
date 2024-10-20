// frontend/src/pages/POIList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POIList = () => {
    const [pois, setPois] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPOIs = async () => {
            try {
                const res = await axios.get('/api/pois', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPois(res.data);
            } catch (err) {
                setError('Error al obtener POIs');
            }
        };
        fetchPOIs();
    }, []);

    return (
        <div className="poi-list-container">
            <h2>Lista de Puntos de Interés</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {pois.map(poi => (
                    <li key={poi.id}>
                        <h3>{poi.nombre}</h3>
                        <p>{poi.descripcion}</p>
                        <p><strong>Categoría:</strong> {poi.categoria}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default POIList;
