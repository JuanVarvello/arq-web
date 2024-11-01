// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'juan1234';

const authenticateToken = (req, res, next) => {
    // Obtener el encabezado de autorización
    const authHeader = req.headers['authorization'];
    // Extraer el token del encabezado
    const token = authHeader && authHeader.split(' ')[1];

    // Verificar si el token no está presente
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token usando jwt
    jwt.verify(token, SECRET_KEY, (err, user) => {
        // Manejar el error de verificación
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        // Si el token es válido, guardar el usuario en la solicitud
        req.user = user;
        // Llamar al siguiente middleware
        next();
    });
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role }, // Payload
        SECRET_KEY, // Clave secreta
        { expiresIn: '1h' } // Opcional: tiempo de expiración del token
    );
};

// Exportar la función de middleware
module.exports = {
    authenticateToken,
    generateToken
};
