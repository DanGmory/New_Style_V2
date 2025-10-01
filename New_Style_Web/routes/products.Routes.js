import {Router} from 'express';
import {showProducts, showProductsId, addProducts, updateProducts, deleteProducts} from '../controllers/products.Controller.js';

const router = Router();
const apiName ='/products';

router.route(apiName)
    .get(showProducts)
    .post(addProducts);

router.route(`${apiName}/:id`)
    .get(showProductsId)
    .put(updateProducts)
    .delete(deleteProducts);
 
export default router;
