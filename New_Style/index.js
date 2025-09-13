// index.js
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import app from './app/app.js'; // Importa el servidor configurado

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

const PORT = process.env.SERVER_PORT || 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz (opcional, si necesitas dashboard.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'dashboard', 'dashboard.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});