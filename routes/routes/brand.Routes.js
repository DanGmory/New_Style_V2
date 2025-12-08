import {Router} from 'express';
import {showBrand, showBrandId, addBrand, updateBrand, deleteBrand} from '../controllers/brand.Controller.js';

const router = Router();
const apiName ='/brand';

router.route(apiName)
    .get(showBrand)
    .post(addBrand);

router.route(`${apiName}/:id`)
    .get(showBrandId)
    .put(updateBrand)
    .delete(deleteBrand);

export default router;
