import jwt from 'jsonwebtoken';
import { connect } from '../config/database.js';
import bcrypt from 'bcrypt';

// Función auxiliar para verificar si un Role_id existe
async function validateRole(roleId) {
    try {
        const sqlQuery = "SELECT * FROM role WHERE Role_id = ?";
        const [rows] = await connect.query(sqlQuery, [roleId]);

        if (rows.length === 0) {
            return false; // El rol no existe
        }

        return true; // El rol existe
    } catch (error) {
        console.error('Error al verificar el rol:', error);
        throw error;
    }
}
// Función para mostrar todos los usuarios con JOINs
export const showUsers = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                users.User_id,
                users.User_name,
                users.User_mail,
                COALESCE(role.Role_name, 'Sin Rol') AS Role,
                COALESCE(state_user.State_user_name, 'Sin Estado') AS State
            FROM users
            LEFT JOIN role ON users.Role_fk = role.Role_id
            LEFT JOIN state_user ON users.State_user_fk = state_user.State_user_id
        `;
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users", details: error.message });
    }
};

// Función para mostrar un usuario por ID
export const showUsersId = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                users.User_id,
                users.User_name,
                users.User_mail,
                users.Role_fk,
                users.State_user_fk,
                users.Company_fk,
                COALESCE(role.Role_name, 'Sin Rol') AS Role,
                COALESCE(state_user.State_user_name, 'Sin Estado') AS State
            FROM users
            LEFT JOIN role ON users.Role_fk = role.Role_id
            LEFT JOIN state_user ON users.State_user_fk = state_user.State_user_id
            WHERE users.User_id = ?
        `;
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user", details: error.message });
    }
};

// Función para agregar un nuevo usuario (CRUD)
export const addUsers = async (req, res) => {
    try {
        const { User_name, User_mail, User_password } = req.body;

        if (!User_name || !User_mail || !User_password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Hashear la contraseña
        const trimmedPassword = User_password.trim();
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Insertar usuario con rol y estado fijo
        const sqlQuery = `
            INSERT INTO users (User_name, User_mail, User_password, Role_fk, State_user_fk)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await connect.query(sqlQuery, [
            User_name,
            User_mail,
            hashedPassword,
            19, // Rol fijo (por ejemplo, 19)
            2   // Estado fijo (por ejemplo, 2)
        ]);

        res.status(201).json({
            data: {
                id: result.insertId,
                User_name,
                User_mail,
                Role_fk: 19,
                State_user_fk: 2
            },
            status: 201
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error registrando usuario", details: error.message });
    }
};

// Función para actualizar un usuario existente
export const updateUsers = async (req, res) => {
    try {
        const { User_name, User_mail, User_password, Role_fk, State_user_fk, Company_fk } = req.body;

        // Si se proporciona una nueva contraseña, hashearla antes de guardarla
        let hashedPassword = null;
        if (User_password) {
            const trimmedPassword = User_password.trim();
            hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        }

        // Actualizar el usuario en la base de datos
        const sqlQuery = `
            UPDATE users
            SET User_name=?, User_mail=?, User_password=?, Role_fk=?, State_user_fk=?, Company_fk=?
            WHERE User_id=?
        `;
        const [result] = await connect.query(sqlQuery, [
            User_name,
            User_mail,
            hashedPassword || null, // Solo actualiza si se proporciona nueva contraseña
            Role_fk,
            State_user_fk,
            Company_fk,
            req.params.id
        ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
        // Respuesta exitosa
        res.status(200).json({
            data: [{ User_name, User_mail, User_password, Role_fk, State_user_fk, Company_fk }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating user", details: error.message });
    }
};

// Función para eliminar un usuario
export const deleteUsers = async (req, res) => {
    try {
        const sqlQuery = "DELETE FROM users WHERE User_id = ?";

        const [result] = await connect.query(sqlQuery, [req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        // Respuesta exitosa
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
};

// Función para manejar el inicio de sesión
export const loginUser = async (req, res) => {
    try {
        // Extraer User_mail y User_password del cuerpo de la solicitud
        const { User_mail, User_password } = req.body;

        // Validar campos obligatorios
        if (!User_mail || !User_password) {
            return res.status(400).json({ error: "Correo electrónico y contraseña son obligatorios" });
        }

        // Buscar al usuario en la base de datos
        const sqlQuery = "SELECT * FROM users WHERE User_mail = ?";
        const [rows] = await connect.query(sqlQuery, [User_mail]);
        if (rows.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const user = rows[0];
        console.log('Usuario encontrado:', user);


        // Comparar la contraseña hasheada con la proporcionada
        console.log('Comparando contraseñas...');
        const isPasswordValid = await bcrypt.compare(User_password, user.User_password);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Obtener el nombre del rol desde la tabla `role`
        const roleQuery = "SELECT Role_name FROM role WHERE Role_id = ?";
        const [roleRows] = await connect.query(roleQuery, [user.Role_fk]);
        const roleName = roleRows.length > 0 ? roleRows[0].Role_name : "Sin Rol";
        // Generar un token JWT
        console.log('Generando token JWT...');
        const token = jwt.sign(
            {
                id: user.User_id,
                User_name: user.User_name,
                User_mail: user.User_mail,
                Role_fk: user.Role_fk,
                Role_name: roleName
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Respuesta exitosa
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user.User_id,
                User_name: user.User_name,
                User_mail: user.User_mail,
                Role_fk: user.Role_fk,
                Role_name: roleName
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
    }
};