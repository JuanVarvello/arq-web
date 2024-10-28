// backend/controllers/poiController.js

const { getPOIs, savePOIs } = require('../models/PoiModel');

// Obtener todos los POIs aprobados o todos si es admin
const getAllPOIs = (req, res) => {
    const pois = getPOIs();
    let aprobados = pois.filter(poi => poi.aprobado);
    if (req.user.role === 'admin') {
        aprobados = pois; // Admin puede ver todos los POIs
    }
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
    const { nombre, descripcion, categoria, ubicacion, imagen } = req.body;
    if (!nombre || !descripcion || !categoria || !ubicacion || !imagen) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    // Validar la estructura de ubicación
    if (
        typeof ubicacion.lat !== 'number' ||
        typeof ubicacion.lng !== 'number'
    ) {
        return res.status(400).json({ message: 'Ubicación inválida' });
    }

    const pois = getPOIs();
    const nuevoPOI = {
        id: pois.length + 1,
        nombre,
        descripcion,
        categoria,
        ubicacion, // { lat, lng }
        aprobado: false,
        creador: req.user.id,
        imagen:imagen,
    };
    pois.push(nuevoPOI);
    savePOIs(pois);
    res.status(201).json({ message: 'POI enviado para aprobación' });
};

// Aprobar un POI (solo admin)
const approvePOI = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const pois = getPOIs();
    const poi = pois.find(p => p.id === parseInt(req.params.id));
    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    poi.aprobado = true;
    savePOIs(pois);
    res.json({ message: 'POI aprobado' });
};

// Rechazar un POI (solo admin)
const rejectPOI = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const pois = getPOIs();
    const poiIndex = pois.findIndex(p => p.id === parseInt(req.params.id));
    if (poiIndex === -1) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    pois.splice(poiIndex, 1);
    savePOIs(pois);
    res.json({ message: 'POI rechazado y eliminado' });
};

// Obtener detalles de un POI
const getPOIDetails = (req, res) => {
    const pois = getPOIs();
    const poi = pois.find(p => p.id === parseInt(req.params.id));
    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    // Si el POI no está aprobado y el usuario no es admin, denegar acceso
    if (!poi.aprobado && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(poi);
};

// Filtrar POIs por categoría
const filterPOIsByCategory = (req, res) => {
    const { categoria } = req.params;
    const pois = getPOIs();
    let filtrados = pois.filter(poi => poi.categoria.toLowerCase() === categoria.toLowerCase() && poi.aprobado);
    if (req.user.role === 'admin') {
        filtrados = pois.filter(poi => poi.categoria.toLowerCase() === categoria.toLowerCase());
    }
    res.json(filtrados);
};

module.exports = {
    getAllPOIs,
    getAllPOIsForAdmin,
    createPOI,
    approvePOI,
    rejectPOI,
    getPOIDetails,
    filterPOIsByCategory,
};
