
import {Router} from 'express';
import {showTypeDocument, showTypeDocumentId, addTypeDocument, updateTypeDocument, deleteTypeDocument} from '../controllers/typeDocument.Controller.js';

const router = Router();
const apiName ='/typeDocument';

router.route(apiName)
    .get(showTypeDocument)
    .post(addTypeDocument);

router.route(`${apiName}/:id`)
    .get(showTypeDocumentId)
    .put(updateTypeDocument)
    .delete(deleteTypeDocument);
 
export default router;
