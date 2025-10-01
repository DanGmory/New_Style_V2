
import {Router} from 'express';
import {showSize, showSizeId, addSize, updateSize, deleteSize} from '../controllers/size.Controller.js';

const router = Router();
const apiName ='/size';

router.route(apiName)
    .get(showSize)
    .post(addSize);

router.route(`${apiName}/:id`)
    .get(showSizeId)
    .put(updateSize)
    .delete(deleteSize);
 
export default router;
