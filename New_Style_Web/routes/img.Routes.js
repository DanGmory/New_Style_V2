import express from 'express';
import {
  uploadFile,
  getImages,
  getImageById,
  updateImage,
  deleteImage
} from '../controllers/img.Controller.js';

const router = express.Router();

router.get('/Img', getImages);
router.get('/Img/:id', getImageById);
router.post('/Img', uploadFile);
router.put('/Img/:id', updateImage);
router.delete('/Img/:id', deleteImage);

export default router;
