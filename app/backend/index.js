// backend/index.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 54321;
const SECRET_KEY = 'tu_clave_secreta'; // En producción, usa variables de entorno

// Rutas de los archivos JSON
const usersFile = path.join(__dirname, 'users.json');
const poisFile = path.join(__dirname, 'pois.json');

// Middleware
app.use(express.json());
app.use(cors());

// Funciones de ayuda para leer y escribir archivos JSON
const readData = (file) => {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify([]));
        }
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error leyendo el archivo ${file}:`, err);
        return [];
    }
};

const writeData = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error escribiendo en el archivo ${file}:`, err);
    }
};

// Cargar datos al inicio
let users = readData(usersFile); // Usuarios registrados
let pois = readData(poisFile);   // Puntos de Interés

// Función para generar tokens JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
};

// Middleware para autenticar tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

// Ruta de Registro
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Usuario ya existe' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            role // 'admin' o 'user'
        };
        users.push(newUser);
        writeData(usersFile, users);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta de Inicio de Sesión
app.post('/api/login', async (req, res) => {
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

        const token = generateToken(user);
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para Obtener Todos los POIs Aprobados
app.get('/api/pois', authenticateToken, (req, res) => {
    let aprobados = pois.filter(poi => poi.aprobado);
    if (req.user.role === 'admin') {
        aprobados = pois; // Admin puede ver todos los POIs
    }
    res.json(aprobados);
});

// Ruta para Obtener Todos los POIs (Solo Admin)
app.get('/api/pois/all', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    res.json(pois);
});

// Ruta para Crear un Nuevo POI
app.post('/api/pois', authenticateToken, (req, res) => {
    const { nombre, descripcion, categoria, ubicacion } = req.body;
    if (!nombre || !descripcion || !categoria || !ubicacion) {
        return res.status(400).json({ message: 'Faltan campos' });
    }

    // Validar la estructura de ubicación
    if (
        typeof ubicacion.lat !== 'number' ||
        typeof ubicacion.lng !== 'number'
    ) {
        return res.status(400).json({ message: 'Ubicación inválida' });
    }

    const nuevoPOI = {
        id: pois.length + 1,
        nombre,
        descripcion,
        categoria,
        ubicacion, // { lat, lng }
        aprobado: false,
        creador: req.user.id
    };
    pois.push(nuevoPOI);
    writeData(poisFile, pois);
    res.status(201).json({ message: 'POI enviado para aprobación' });
});

// Ruta para Aprobar un POI (Admin)
app.post('/api/pois/:id/aprobar', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const poi = pois.find(p => p.id === parseInt(req.params.id));
    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    poi.aprobado = true;
    writeData(poisFile, pois);
    res.json({ message: 'POI aprobado' });
});

// Ruta para Rechazar un POI (Admin)
app.post('/api/pois/:id/rechazar', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const poiIndex = pois.findIndex(p => p.id === parseInt(req.params.id));
    if (poiIndex === -1) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    pois.splice(poiIndex, 1);
    writeData(poisFile, pois);
    res.json({ message: 'POI rechazado y eliminado' });
});

// Ruta para Obtener Detalles de un POI
app.get('/api/pois/:id', authenticateToken, (req, res) => {
    const poi = pois.find(p => p.id === parseInt(req.params.id));
    if (!poi) {
        return res.status(404).json({ message: 'POI no encontrado' });
    }

    // Si el POI no está aprobado y el usuario no es admin, denegar acceso
    if (!poi.aprobado && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(poi);
});

// Ruta para Filtrar POIs por Categoría
app.get('/api/pois/categoria/:categoria', authenticateToken, (req, res) => {
    const { categoria } = req.params;
    let filtrados = pois.filter(poi => poi.categoria.toLowerCase() === categoria.toLowerCase() && poi.aprobado);
    if (req.user.role === 'admin') {
        filtrados = pois.filter(poi => poi.categoria.toLowerCase() === categoria.toLowerCase());
    }
    res.json(filtrados);
});

// Ruta para Eliminar un Usuario (Opcional, Solo Admin)
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    users.splice(userIndex, 1);
    writeData(usersFile, users);
    res.json({ message: 'Usuario eliminado' });
});

// Ruta para Obtener Información del Usuario Actual
app.get('/api/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No enviar la contraseña
    const { password, ...userData } = user;
    res.json(userData);
});

// Iniciar el Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
