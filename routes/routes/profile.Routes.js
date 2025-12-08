import {Router} from 'express';
import {showProfile, showProfileId, addProfile, updateProfile, deleteProfile} from '../controllers/profile.Controller.js';

const router = Router();
const apiName ='/profile';

router.route(apiName)
    .get(showProfile)
    .post(addProfile);

router.route(`${apiName}/:id`)
    .get(showProfileId)
    .put(updateProfile)
    .delete(deleteProfile);
export default router;
