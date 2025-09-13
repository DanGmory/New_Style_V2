import {Router} from 'express';
import {showRole, showRoleId, addRole, updateRole, deleteRole} from '../controllers/role.Controller.js';

const router = Router();
const apiName ='/role';

router.route(apiName)
    .get(showRole)
    .post(addRole);

router.route(`${apiName}/:id`)
    .get(showRoleId)
    .put(updateRole)
    .delete(deleteRole);

export default router;
