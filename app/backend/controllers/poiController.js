// backend/controllers/poiController.js

const {
    getPOIs,
    createPOI: createPOIModel,
    approvePOI: approvePOIModel,
    rejectPOI: rejectPOIModel,
    getPOIById,
} = require('../models/PoiModel');

// Obtener todos los POIs aprobados o todos si es admin
const getAllPOIs = (req, res) => {
    const pois = getPOIs();
    const aprobados = req.user.role === 'admin' ? pois : pois.filter((poi) => poi.aprobado);
    res.json(aprobados);
};

// Obtener todos los POIs (solo admin)
const getAllPOIsForAdmin = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    res.json(getPOIs());
};

// Crear un nuevo POI
const createPOI = (req, res) => {
    const { nombre, descripcion, categoria, ubicacion } = req.body;

    // Validar campos requeridos
    if (!nombre || !descripcion || !categoria || !ubicacion) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    // Validar estructura de ubicación
    if (typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number') {
        return res.status(400).json({ message: 'Ubicación inválida' });
    }

    const nuevoPOI = {
        id: getPOIs().length + 1,
        nombre,
        descripcion,
        categoria,
        ubicacion,
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

// Obtener detalles de un POI
const getPOIDetails = (req, res) => {
    const poi = getPOIById(parseInt(req.params.id));

    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    if (!poi.aprobado && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(poi);
};

module.exports = {
    getAllPOIs,
    getAllPOIsForAdmin,
    createPOI,
    approvePOI,
    rejectPOI,
    getPOIDetails,
};
