// frontend/src/pages/MapPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar icono de Leaflet (opcional, para personalizar pines)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPage = () => {
    const [pois, setPois] = useState([]);
    const [position, setPosition] = useState([-38.9517, -68.0598]); // Coordenadas de Neuquén
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

    // Detectar la ubicación del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setPosition([position.coords.latitude, position.coords.longitude]);
            }, () => {
                console.log('No se pudo obtener la ubicación');
            });
        }
    }, []);

    return (
        <div>
            {error && <p className="error">{error}</p>}
            <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pois.map(poi => (
                    <Marker key={poi.id} position={[poi.ubicacion.lat, poi.ubicacion.lng]}>
                        <Popup>
                            <h3>{poi.nombre}</h3>
                            <p>{poi.descripcion}</p>
                            <p><strong>Categoría:</strong> {poi.categoria}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;
