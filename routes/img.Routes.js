import express from 'express';
import {
  uploadFile,
  getImages,
  getImageById,
  updateImage,
  deleteImage
} from '../controllers/img.Controller.js';

const router = express.Router();

router.get('/img', getImages);
router.get('/img/:id', getImageById);
router.post('/img', uploadFile);
router.put('/img/:id', updateImage);
router.delete('/img/:id', deleteImage);

export default router;
