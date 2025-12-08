import {Router} from 'express';
import {showStateUser, showStateUserId, addStateUser, updateStateUser, deleteStateUser} from '../controllers/stateUser.Controller.js';

const router = Router();
const apiName ='/stateUser';

router.route(apiName)
    .get(showStateUser)
    .post(addStateUser);

router.route(`${apiName}/:id`)
    .get(showStateUserId)
    .put(updateStateUser)
    .delete(deleteStateUser);

export default router;
