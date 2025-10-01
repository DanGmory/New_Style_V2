import { Router } from 'express';
import { showUsers, showUsersId, addUsers, updateUsers, deleteUsers, loginUser } from '../controllers/users.Controller.js';

const router = Router();
const apiName = '/users';

// Rutas CRUD existentes
router.route(apiName)
    .get(showUsers) // Obtener todos los usuarios
    .post(addUsers); // Crear un nuevo usuario

router.route(`${apiName}/:id`)
    .get(showUsersId) // Obtener un usuario por ID
    .put(updateUsers) // Actualizar un usuario por ID
    .delete(deleteUsers); // Eliminar un usuario por ID


// Nueva ruta para el inicio de sesión
router.post(`${apiName}/login`, loginUser);

export default router;