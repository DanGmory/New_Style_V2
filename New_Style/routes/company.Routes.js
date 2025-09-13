import {Router} from 'express';
import {showCompany, showCompanyId, addCompany, updateCompany, deleteCompany} from '../controllers/company.Controller.js';

const router = Router();
const apiName ='/company';

router.route(apiName)
    .get(showCompany)
    .post(addCompany);

router.route(`${apiName}/:id`)
    .get(showCompanyId)
    .put(updateCompany)
    .delete(deleteCompany);

export default router;
