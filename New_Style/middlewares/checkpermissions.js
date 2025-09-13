// middleware/checkPermission.js
import { connect } from '../config/database.js';

export const checkPermission = (moduleRoute, requiredAction) => {
    return async (req, res, next) => {
        try {
            const user = req.user; // se asume que ya está autenticado y tiene role_id
            const connection = await connect();

            const [rows] = await connection.execute(`
                SELECT rm.Permissions
                FROM role_module rm
                JOIN module m ON rm.Module_fk = m.Module_id
                WHERE rm.Role_fk = ? AND m.Module_route = ?
            `, [user.Role_fk, moduleRoute]);

            if (rows.length === 0) {
                return res.status(403).json({ message: 'Módulo no autorizado para este rol' });
            }

            const permissions = rows[0].Permissions.split(',').map(p => p.trim());

            if (permissions.includes('*') || permissions.includes(requiredAction)) {
                return next();
            }

            return res.status(403).json({ message: `Permiso "${requiredAction}" denegado` });
        } catch (error) {
            console.error('Error en checkPermission:', error);
            return res.status(500).json({ message: 'Error al verificar permisos' });
        }
    };
};
