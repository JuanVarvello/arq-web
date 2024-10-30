// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const { usersFile, readUsers, writeUsers } = require('../models/UserModel');
const { generateToken } = require('../middleware/authMiddleware');
let users = readUsers(usersFile); // Cargar usuarios al inicio
console.log(users);

// Función para registrar un nuevo usuario
const register = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    const users = readUsers(); // Asegúrate de leer los usuarios primero
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Usuario ya existe' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1, // Asignar ID único
            username,
            password: hashedPassword,
            role // 'admin' o 'user'
        };
        users.push(newUser);
        writeUsers(users); // Guardar usuarios, no necesitas pasar usersFile
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Función para iniciar sesión
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = generateToken(user); // Supone que la función generateToken está disponible
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
