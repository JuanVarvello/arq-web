// backend/controllers/poiController.js

const {
    getPOIs,
    createPOI: createPOIModel,
    approvePOI: approvePOIModel,
    rejectPOI: rejectPOIModel
} = require('../models/PoiModel');

// Obtener todos los POIs aprobados o todos si es admin
const getAllPOIs = async (req, res) => {
    try {
        // Await the async function to get the POIs
        const pois = await getPOIs();
        // Filter POIs based on the user's role
        const aprobados = req.user.role === 'admin' ? pois : pois.filter((poi) => poi.aprobado);
        // Send the filtered POIs as JSON
        res.json(aprobados);
    } catch (error) {
        console.error('Error fetching POIs:', error);
        res.status(500).json({ error: 'Error fetching POIs' });
    }
};

// Crear un nuevo POI
const createPOI = (req, res) => {
    const { nombre, descripcion, categoria, ubicacion, imagen } = req.body;

    // Validar campos requeridos
    if (!nombre || !descripcion || !categoria || !ubicacion) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    // Validar estructura de ubicación
    if (typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number') {
        return res.status(400).json({ message: 'Ubicación inválida' });
    }

    const nuevoPOI = {
        id: Date.now(),
        nombre,
        descripcion,
        categoria,
        ubicacion,
        imagen,
        aprobado: false,
        creador: req.user.id,
    };

    createPOIModel(nuevoPOI);
    res.status(201).json({ message: 'POI enviado para aprobación' });
};

// Aprobar un POI (solo admin)
const approvePOI = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const poi = approvePOIModel(parseInt(req.params.id));
    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    res.json({ message: 'POI aprobado' });
};

// Rechazar un POI (solo admin)
const rejectPOI = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const poi = rejectPOIModel(parseInt(req.params.id));
    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    res.json({ message: 'POI rechazado y eliminado' });
};

module.exports = {
    getAllPOIs,
    createPOI,
    approvePOI,
    rejectPOI
};
