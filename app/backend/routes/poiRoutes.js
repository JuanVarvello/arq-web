// backend/routes/poiRoutes.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    getAllPOIs,
    getAllPOIsForAdmin,
    createPOI,
    approvePOI,
    rejectPOI,
    getPOIDetails,
    filterPOIsByCategory,
} = require('../controllers/poiController');

// Ruta para obtener todos los POIs aprobados
router.get('/pois', authenticateToken, getAllPOIs);

// Ruta para obtener todos los POIs (solo admin)
router.get('/pois/all', authenticateToken, getAllPOIsForAdmin);

// Ruta para crear un nuevo POI
router.post('/pois', authenticateToken, createPOI);

// Ruta para aprobar un POI (solo admin)
router.post('/pois/:id/aprobar', authenticateToken, approvePOI);

// Ruta para rechazar un POI (solo admin)
router.post('/pois/:id/rechazar', authenticateToken, rejectPOI);

// Ruta para obtener detalles de un POI
router.get('/pois/:id', authenticateToken, getPOIDetails);

// Ruta para filtrar POIs por categoría
router.get('/categoria/:categoria', authenticateToken, filterPOIsByCategory);

module.exports = router;
