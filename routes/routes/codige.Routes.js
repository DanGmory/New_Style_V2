import {Router} from 'express';
import {showCodige, showCodigeId, addCodige, updateCodige, deleteCodige} from '../controllers/codige.Controller.js';

const router = Router();
const apiName ='/codige';

router.route(apiName)
    .get(showCodige)
    .post(addCodige);

router.route(`${apiName}/:id`)
    .get(showCodigeId)
    .put(updateCodige)
    .delete(deleteCodige);
export default router;
