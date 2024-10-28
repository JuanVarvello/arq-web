// backend/models/userModel.js
const fs = require('fs');
const path = require('path');

// Ruta al archivo users.json
const usersFile = path.join(__dirname, '../users.json');

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

// Exportar las funciones
module.exports = {
    readUsers,
    writeUsers,
    usersFile,
};
