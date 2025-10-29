import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import app from './app/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

const PORT = process.env.SERVER_PORT || 3000;
const HOST = '0.0.0.0';

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'generalViews', 'home', 'home.html'));
});

// Ruta login
app.get('/generalViews/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'generalViews', 'login', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
