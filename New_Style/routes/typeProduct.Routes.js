
import {Router} from 'express';
import {showTypeProduct, showTypeProductId, addTypeProduct, updateTypeProduct, deleteTypeProduct} from '../controllers/typeProduct.Controller.js';

const router = Router();
const apiName ='/typeProduct';

router.route(apiName)
    .get(showTypeProduct)
    .post(addTypeProduct);

router.route(`${apiName}/:id`)
    .get(showTypeProductId)
    .put(updateTypeProduct)
    .delete(deleteTypeProduct);
 
export default router;
