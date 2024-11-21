// backend/controllers/authController.js

const { generateToken } = require('../middleware/authMiddleware');
const {
    createUser,
    validateUserCredentials,
    findUserByUsername
} = require('../models/UserModel');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
const register = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Faltan campos' });
    }
    console.log('Registrando usuario:', username, role);
    const existingUser = await findUserByUsername(username);
    console.log('Usuario existente:', existingUser);
    if (existingUser) {
        return res.status(400).json({ message: 'Usuario ya existe' });
    }

    try {
        await createUser(username, password, role);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Iniciar sesión
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    try {
        const user = await validateUserCredentials(username, password);
        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = generateToken(user); // Generar el token para el usuario
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    register,
    login
};
