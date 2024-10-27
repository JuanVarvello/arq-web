// frontend/src/pages/AddPOI.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './AddPOI.css'; // Asegúrate de tener los estilos CSS incluidos aquí
const AddPOI = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagenUrl, setImagenUrl] = useState(''); // Nuevo campo para URL de imagen
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/pois', {
                nombre,
                descripcion,
                categoria,
                imagen: imagenUrl,
                ubicacion: { lat: parseFloat(lat), lng: parseFloat(lng) }
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('POI enviado para aprobación');
            setError('');
            setTimeout(() => {
                navigate('/map');
            }, 2000);
        } catch (err) {
            setError(err.response.data.message);
            setSuccess('');
        }
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                setLat(e.latlng.lat);
                setLng(e.latlng.lng);
            }
        });
        return null;
    };

    return (
        <div className="add-poi-container">
            <h2>Agregar Punto de Interés</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                </div>
                <div>
                    <label>Categoría:</label>
                    <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
                </div>
                <div>
                    <label>URL de la Imagen:</label>
                    <input type="url" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>
                <div>
                    <MapContainer center={[-38.95, -68.06]} zoom={13} style={{ height: '300px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {lat && lng && <Marker position={[lat, lng]}></Marker>}
                        <MapClickHandler />
                    </MapContainer>
                </div>
                {lat && lng && (
                    <div>
                        <p>Latitud: {lat}</p>
                        <p>Longitud: {lng}</p>
                    </div>
                )}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit">Enviar POI</button>
            </form>
        </div>
    );
};

export default AddPOI;
