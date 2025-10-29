import {Router} from 'express';
import {showAddress, showAddressId, addAddress, updateAddress, deleteAddress} from '../controllers/address.Controller.js';

const router = Router();
const apiName ='/address';

router.route(apiName)
    .get(showAddress)
    .post(addAddress);

router.route(`${apiName}/:id`)
    .get(showAddressId)
    .put(updateAddress)
    .delete(deleteAddress);
export default router;
