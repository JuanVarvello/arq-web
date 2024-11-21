import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './css/MapPage.css'; // Ensure your CSS file is included

const customMarker = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -41] // Point from which the popup should open relative to the iconAnchor
});

const MapPage = () => {
    const [pois, setPois] = useState([]);
    const [position, setPosition] = useState([-38.9517, -68.0598]); // Default to Neuquén
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPOIs = async () => {
            try {
                const res = await axios.get('/api/pois', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                console.log('Raw API Response:', res.data);
                console.log('API Response Type:', typeof res.data);
    
                let poisData = res.data;
                console.log('POIs Data:', poisData);
    
                // If the response is a string, try parsing it as JSON
                if (typeof poisData === 'string') {
                    try {
                        poisData = JSON.parse(poisData);
                    } catch (e) {
                        console.error('Error parsing string response:', e);
                        setError('Error parsing API response');
                        return;
                    }
                }
    
                // Check if the parsed response is an array
                if (Array.isArray(poisData)) {
                    setPois(poisData);
                } else if (poisData.pois && Array.isArray(poisData.pois)) {
                    setPois(poisData.pois); // Handle { pois: [...] } format
                } else {
                    console.error('Unexpected response structure:', poisData);
                    setError('Los datos recibidos no son válidos');
                }
            } catch (err) {
                console.error('Error fetching POIs:', err);
                setError('Error al obtener POIs');
            }
        };
        fetchPOIs();
    }, []);
    

    // Detect user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setPosition([position.coords.latitude, position.coords.longitude]);
            }, () => {
                console.log('Unable to retrieve location');
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
                {Array.isArray(pois) ? (
                    pois.map(poi => (
                        <Marker 
                            key={poi.id} 
                            position={[poi.ubicacion.lat, poi.ubicacion.lng]}
                            icon={customMarker} // Use the custom marker
                        >
                            <Popup>
                                <h3>{poi.nombre}</h3>
                                <p>{poi.descripcion}</p>
                                <img src={poi.imagen} alt={poi.nombre} className="poi-image" />
                                <p><strong>Categoría:</strong> {poi.categoria}</p>
                            </Popup>
                        </Marker>
                    ))
                ) : (
                    <p>No se pueden mostrar los POIs porque los datos no son válidos</p>
                )}
            </MapContainer>
        </div>
    );
};

export default MapPage;
