// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet
import './index.css'; // Tu archivo de estilos principal

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
