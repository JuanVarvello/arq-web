const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const poiRoutes = require('./routes/poiRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 54321;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', authRoutes);
app.use('/api', poiRoutes);
app.use('/api', userRoutes);

// Iniciar el Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
