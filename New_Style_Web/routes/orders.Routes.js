import {Router} from 'express';
import {showOrders, showOrdersId, addOrders, updateOrders, deleteOrders} from '../controllers/orders.Controller.js';

const router = Router();
const apiName ='/orders';

router.route(apiName)
    .get(showOrders)
    .post(addOrders);

router.route(`${apiName}/:id`)
    .get(showOrdersId)
    .put(updateOrders)
    .delete(deleteOrders);
export default router;
