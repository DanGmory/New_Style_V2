import {Router} from 'express';
import {showModule, showModuleId, addModule, updateModule, deleteModule} from '../controllers/module.Controller.js';

const router = Router();
const apiName ='/module';

router.route(apiName)
    .get(showModule)
    .post(addModule);

router.route(`${apiName}/:id`)
    .get(showModuleId)
    .put(updateModule)
    .delete(deleteModule);
 
export default router;
