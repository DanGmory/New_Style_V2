import {Router} from 'express';
import {showStateOrder, showStateOrderId, addStateOrder, updateStateOrder, deleteStateOrder} from '../controllers/stateOrder.Controller.js';

const router = Router();
const apiName ='/stateOrder';

router.route(apiName)
    .get(showStateOrder)
    .post(addStateOrder);

router.route(`${apiName}/:id`)
    .get(showStateOrderId)
    .put(updateStateOrder)
    .delete(deleteStateOrder);
 
export default router;
