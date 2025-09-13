
import { connect } from '../config/database.js';
import bcrypt from 'bcrypt';

// Función para hashear la contraseña
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Crear un nuevo usuario
export const createUser = async (userName, userEmail, userPassword, roleId, stateUserId, CompanyId) => {
    try {
        const hashedPassword = await hashPassword(userPassword);
        const sqlQuery = `
            INSERT INTO users (User_name, User_mail, User_password, Role_id, State_user_id, Company_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connect.query(sqlQuery, [userName, userEmail, hashedPassword, roleId, stateUserId, CompanyId]);
        return result;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

// Buscar un usuario por correo electrónico
export const findUserByEmail = async (userEmail) => {
    try {
        const sqlQuery = 'SELECT * FROM users WHERE User_mail = ?';
        const [rows] = await connect.query(sqlQuery, [userEmail]);
        return rows[0];
    } catch (error) {
        throw new Error(`Error finding user by email: ${error.message}`);
    }
};