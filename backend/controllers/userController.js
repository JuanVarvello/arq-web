// userController.js
const { usersFile, writeUsers } = require('../models/UserModel');

// Ruta para Eliminar un Usuario (Opcional, Solo Admin)
const deleteUser = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const userIndex = usersFile.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usersFile.splice(userIndex, 1);
    writeUsers();
    res.json({ message: 'Usuario eliminado' });
};

// Ruta para Obtener Información del Usuario Actual
const getCurrentUser = (req, res) => {
    const user = usersFile.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No enviar la contraseña
    const { password, ...userData } = user;
    res.json(userData);
};

module.exports = { deleteUser, getCurrentUser };
