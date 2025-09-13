import {Router} from 'express';
import {showColors, showColorsId, addColors, updateColors, deleteColors} from '../controllers/colors.Controller.js';

const router = Router();
const apiName ='/colors';

router.route(apiName)
    .get(showColors)
    .post(addColors);

router.route(`${apiName}/:id`)
    .get(showColorsId)
    .put(updateColors)
    .delete(deleteColors);
 
export default router;
