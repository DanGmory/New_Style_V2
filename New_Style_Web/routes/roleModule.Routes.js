import { Router } from "express";
import {
  showRoleModule,
  showRoleModuleId,
  addRoleModule,
  updateRoleModule,
  deleteRoleModule,
  roleModuleUser
} from "../controllers/roleModule.Controller.js";

const router = Router();
const apiName = "/roleModule";
const apiNameUser = "/roleModuleUser";

router.route(apiName).get(showRoleModule).post(addRoleModule);

router
  .route(`${apiName}/:id`)
  .get(showRoleModuleId)
  .put(updateRoleModule)
  .delete(deleteRoleModule);

router
  .route(`${apiNameUser}/:id`)
  .post(roleModuleUser);


export default router;
