import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPOIs.css';

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
                setPois(res.data);
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
            // Actualizar el estado sin el POI aprobado
            setPois(pois.map(poi => poi.id === id ? { ...poi, aprobado: true } : poi));
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
            // Actualizar el estado sin el POI rechazado
            setPois(pois.filter(poi => poi.id !== id));
        } catch (err) {
            setError('Error al rechazar POI');
        }
    };

    const pendingPOIs = pois.filter(poi => !poi.aprobado);
    const approvedPOIs = pois.filter(poi => poi.aprobado);

    return (
        <div className="admin-pois-container">
            <h2>Administrar POIs</h2>
            {error && <p className="error">{error}</p>}

            <div className="poi-list">
                <h3>POIs Pendientes</h3>
                {pendingPOIs.length > 0 ? (
                    pendingPOIs.map(poi => (
                        <div key={poi.id} className="poi-card">
                            <img src={poi.imagen} alt={poi.nombre} className="poi-image" />
                            <div className="poi-details">
                                <h3 className="poi-title">{poi.nombre}</h3>
                                <p className="poi-description">{poi.descripcion}</p>
                                <p className="poi-category"><strong>Categoría:</strong> {poi.categoria}</p>
                            </div>
                            <div className="poi-buttons">
                                <button className="approve-button" onClick={() => approvePOI(poi.id)}>Aprobar</button>
                                <button className="reject-button" onClick={() => rejectPOI(poi.id)}>Rechazar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay POIs pendientes de aprobación.</p>
                )}
            </div>

            <div className="poi-list">
                <h3>POIs Aprobados</h3>
                {approvedPOIs.length > 0 ? (
                    approvedPOIs.map(poi => (
                        <div key={poi.id} className="poi-card">
                            <img src={poi.imagen} alt={poi.nombre} className="poi-image" />
                            <div className="poi-details">
                                <h3 className="poi-title">{poi.nombre}</h3>
                                <p className="poi-description">{poi.descripcion}</p>
                                <p className="poi-category"><strong>Categoría:</strong> {poi.categoria}</p>
                            </div>
                            <div className="poi-buttons">
                                <button className="reject-button" onClick={() => rejectPOI(poi.id)}>Rechazar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay POIs aprobados.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPOIs;

