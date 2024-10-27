// frontend/src/pages/MapPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPage.css'; // Asegúrate de tener los estilos CSS incluidos aquí

// Usar el enlace proporcionado como icono de marcador personalizado
const customMarker = new L.Icon({
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/social-media-8/512/pointer.png',
    iconSize: [52, 52], // Tamaño del icono
    iconAnchor: [16, 32], // Ancla del icono (centra el marcador)
    popupAnchor: [0, -30] // Ancla del pop-up
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
                    <Marker 
                        key={poi.id} 
                        position={[poi.ubicacion.lat, poi.ubicacion.lng]}
                        icon={customMarker} // Usar el marcador personalizado
                    >
                        <Popup>
                            <h3>{poi.nombre}</h3>
                            <p>{poi.descripcion}</p>
                            <img src={poi.imagen} alt={poi.nombre} className="poi-image" />
                            <p><strong>Categoría:</strong> {poi.categoria}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;
