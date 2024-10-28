// backend/models/poiModel.js

const fs = require('fs');
const path = require('path');

// Archivo donde se almacenarán los POIs
const poisFile = path.join(__dirname, '../pois.json');

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

// Leer POIs desde el archivo
const getPOIs = () => readData(poisFile);

// Escribir POIs en el archivo
const savePOIs = (pois) => writeData(poisFile, pois);

module.exports = {
    getPOIs,
    savePOIs,
};
