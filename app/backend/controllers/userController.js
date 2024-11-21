// backend/controllers/userController.js

const {
    deleteUserById
} = require('../models/UserModel');

// Ruta para eliminar un usuario (opcional, solo admin)
const deleteUser = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const success = deleteUserById(parseInt(req.params.id));
    if (!success) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
};


module.exports = { deleteUser };