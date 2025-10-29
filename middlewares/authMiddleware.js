import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Configurar variables de entorno
dotenv.config();

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const token = req.header("Authorization");

    // Si no hay token, denegar acceso
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }

    try {
        // Eliminar el prefijo "Bearer " del token
        const cleanedToken = token.replace("Bearer ", "");

        // Verificar el token utilizando la clave secreta JWT
        const verified = jwt.verify(cleanedToken, process.env.JWT_SECRET);

        // Agregar el usuario verificado al objeto request para su uso posterior
        req.user = verified;

        // Continuar con la siguiente función de middleware o ruta
        next();
    } catch (error) {
        // Manejar errores de token inválido
        res.status(400).json({ error: "Invalid Token" });
    }
};