// backend/models/userModel.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');


// Ruta al archivo users.json
const usersFile = path.join(__dirname, '../../data/users.json');

// Función para leer los datos de usuarios desde el archivo JSON
const readUsers = () => {
    try {
        // Si el archivo no existe, crear uno vacío
        if (!fs.existsSync(usersFile)) {
            fs.writeFileSync(usersFile, JSON.stringify([]));
        }
        // Leer el archivo y parsear el JSON
        const data = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error leyendo el archivo ${usersFile}:`, err);
        return []; // Devuelve un array vacío en caso de error
    }
};

// Función para escribir los datos de usuarios en el archivo JSON
const writeUsers = (data) => {
    try {
        // Validar que data sea un array
        if (!Array.isArray(data)) {
            throw new Error('Los datos a escribir deben ser un array');
        }
        // Escribir los datos en el archivo JSON con formato
        fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error escribiendo en el archivo ${usersFile}:`, err);
    }
};

// Buscar un usuario por nombre de usuario
const findUserByUsername = (username) => {
    const users = readUsers();
    return users.find(user => user.username === username);
};

// Crear un nuevo usuario
const createUser = async (username, password, role) => {
    const users = readUsers();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1, // Generar ID único
        username,
        password: hashedPassword,
        role // 'admin' o 'user'
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
};

// Verificar las credenciales de un usuario
const validateUserCredentials = async (username, password) => {
    const user = findUserByUsername(username);
    if (!user) {
        return null; // Usuario no encontrado
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return null; // Contraseña incorrecta
    }

    return user; // Usuario válido
};

// Obtener la información del usuario (sin contraseña)
const getUserDataWithoutPassword = (id) => {
    const user = findUserById(id);
    if (!user) {
        return null; // Usuario no encontrado
    }
    const { password, ...userData } = user; // Excluir la contraseña
    return userData;
};

// Eliminar un usuario por ID
const deleteUserById = (id) => {
    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return false; // Usuario no encontrado
    }
    users.splice(userIndex, 1);
    writeUsers(users);
    return true; // Usuario eliminado
};

module.exports = {
    readUsers,
    writeUsers,
    findUserByUsername,
    createUser,
    validateUserCredentials,
    getUserDataWithoutPassword,
    deleteUserById
};
