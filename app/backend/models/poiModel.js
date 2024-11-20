// backend/models/poiModel.js

const fs = require('fs');
const path = require('path');

// Archivo donde se almacenarán los POIs
const poisFile = path.join(__dirname, '../../data/pois.json');

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

// Crear un nuevo POI
const createPOI = (nuevoPOI) => {
    const pois = getPOIs();
    pois.push(nuevoPOI);
    savePOIs(pois);
};

// Leer POIs desde el archivo
const getPOIs = () => readData(poisFile);

// Escribir POIs en el archivo
const savePOIs = (pois) => writeData(poisFile, pois);

// Aprobar un POI
const approvePOI = (id) => {
    const pois = getPOIs();
    const poi = pois.find((p) => p.id === id);
    if (poi) {
        poi.aprobado = true;
        savePOIs(pois);
    }
    return poi;
};

// Rechazar un POI
const rejectPOI = (id) => {
    const pois = getPOIs();
    const poiIndex = pois.findIndex((p) => p.id === id);
    if (poiIndex !== -1) {
        const [deletedPOI] = pois.splice(poiIndex, 1);
        savePOIs(pois);
        return deletedPOI;
    }
    return null;
};

// Obtener un POI por ID
const getPOIById = (id) => {
    const pois = getPOIs();
    return pois.find((p) => p.id === id);
};

module.exports = {
    getPOIs,
    savePOIs,
    approvePOI,
    rejectPOI,
    getPOIById,
    createPOI
};
