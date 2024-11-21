// userRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware'); // Asegúrate de tener este middleware definido
const { deleteUser } = require('../controllers/userController');

const router = express.Router();

// Ruta para Eliminar un Usuario (Opcional, Solo Admin)
router.delete('/api/users/:id', authenticateToken, deleteUser);

module.exports = router;
