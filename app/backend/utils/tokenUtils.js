const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // En producción, usa variables de entorno

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = { generateToken };
