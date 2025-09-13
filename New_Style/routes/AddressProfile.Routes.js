import {Router} from 'express';
import {showAddressProfile, showAddressProfileId, addAddressProfile, updateAddressProfile, deleteAddressProfile} from '../controllers/AddressProfile.Controller.js';

const router = Router();
const apiName ='/AddressProfile';

router.route(apiName)
    .get(showAddressProfile)
    .post(addAddressProfile);

router.route(`${apiName}/:id`)
    .get(showAddressProfileId)
    .put(updateAddressProfile)
    .delete(deleteAddressProfile);
 
export default router;
