import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connect } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carpeta física donde se guardan las imágenes
const pathImage = path.join(__dirname, '../public/assets/imgs');

// Crear la carpeta si no existe
if (!fs.existsSync(pathImage)) {
  fs.mkdirSync(pathImage, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathImage);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// SUBIR nueva imagen
export const uploadFile = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const customName = req.body.name || req.file.originalname;
      const imageUrl = `/assets/imgs/${req.file.filename}`; // <-- CORRECTO

      await connect.query(
        'INSERT INTO images (Image_name, Image_url) VALUES (?, ?)',
        [customName, imageUrl]
      );

      res.status(200).json({
        message: 'File uploaded and saved to DB successfully',
        file: { name: customName, url: imageUrl }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
];

// GET todas las imágenes
export const getImages = async (req, res) => {
  try {
    const [rows] = await connect.query('SELECT * FROM images');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las imágenes' });
  }
};

// GET imagen por ID
export const getImageById = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM images WHERE Image_id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Imagen no encontrada" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la imagen", details: error.message });
  }
};

// PUT actualizar imagen
export const updateImage = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { name } = req.body;
      const imageId = req.params.id;

      // Obtener imagen previa
      const [result] = await connect.query('SELECT * FROM images WHERE Image_id = ?', [imageId]);
      if (result.length === 0) return res.status(404).json({ error: "Imagen no encontrada" });

      const prevImg = result[0];
      let imageUrl = prevImg.Image_url;

      // Si hay nuevo archivo, eliminar el anterior
      if (req.file) {
        const fullPath = path.join(__dirname, '../public', prevImg.Image_url); // <-- CORRECTO
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        imageUrl = `/assets/imgs/${req.file.filename}`; // <-- CORRECTO
      }

      const newName = name || prevImg.Image_name;

      const [update] = await connect.query(
        'UPDATE images SET Image_name = ?, Image_url = ? WHERE Image_id = ?',
        [newName, imageUrl, imageId]
      );

      res.status(200).json({
        message: 'Imagen actualizada correctamente',
        updated: update.affectedRows
      });

    } catch (error) {
      res.status(500).json({ error: "Error al actualizar imagen", details: error.message });
    }
  }
];

// DELETE imagen
export const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Buscar la imagen
    const [result] = await connect.query('SELECT * FROM images WHERE Image_id = ?', [imageId]);
    if (result.length === 0) return res.status(404).json({ error: "Imagen no encontrada" });

    const img = result[0];

    // Eliminar archivo físico
    const fullPath = path.join(__dirname, '../public', img.Image_url); // <-- CORRECTO
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    // Eliminar de la base de datos
    const [del] = await connect.query('DELETE FROM images WHERE Image_id = ?', [imageId]);

    res.status(200).json({
      message: 'Imagen eliminada correctamente',
      deleted: del.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar imagen", details: error.message });
  }
};