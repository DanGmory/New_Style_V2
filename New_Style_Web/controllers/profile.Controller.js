import { connect } from '../config/database.js';

export const showProfile = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                p.Profile_id,
                p.Profile_name,
                p.Profile_lastname,
                p.Profile_phone,
                p.Profile_number_document,
                p.User_fk,
                p.image_fk,
                p.Type_document_fk,
                p.Address_fk,
                COALESCE(u.User_mail, 'Sin correo') AS User_mail,
                COALESCE(t.Type_document_name, 'Sin tipo') AS Type_document_name,
                i.Image_url
            FROM profile p
            LEFT JOIN users u ON p.User_fk = u.User_id
            LEFT JOIN type_document t ON p.Type_document_fk = t.Type_document_id
            LEFT JOIN images i ON p.image_fk = i.Image_id
        `;
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile", details: error.message });
    }
};

export const showProfileId = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                p.Profile_id,
                p.Profile_name,
                p.Profile_lastname,
                p.Profile_phone,
                p.Profile_number_document,
                p.User_fk,
                p.image_fk,
                p.Type_document_fk,
                p.Address_fk,
                COALESCE(u.User_mail, 'Sin correo') AS User_mail,
                COALESCE(t.Type_document_name, 'Sin tipo') AS Type_document_name,
                i.Image_url
            FROM profile p
            LEFT JOIN users u ON p.User_fk = u.User_id
            LEFT JOIN type_document t ON p.Type_document_fk = t.Type_document_id
            LEFT JOIN images i ON p.image_fk = i.Image_id
            WHERE p.Profile_id = ?
        `;
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Profile not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile", details: error.message });
    }
};

export const addProfile = async (req, res) => {
    try {
        const { Profile_name, Profile_lastname, Profile_phone, Profile_number_document, User_fk, image_fk, Type_document_fk, Address_fk } = req.body;
        // Validación detallada
        const missingFields = [];
        if (!Profile_name || !String(Profile_name).trim()) missingFields.push('Profile_name');
        if (!Profile_lastname || !String(Profile_lastname).trim()) missingFields.push('Profile_lastname');
        if (!Profile_phone || !String(Profile_phone).trim()) missingFields.push('Profile_phone');
        if (!Profile_number_document || !String(Profile_number_document).trim()) missingFields.push('Profile_number_document');
        const userId = Number(User_fk);
        if (!userId || Number.isNaN(userId)) missingFields.push('User_fk');
        const typeDocId = Number(Type_document_fk);
        if (!typeDocId || Number.isNaN(typeDocId)) missingFields.push('Type_document_fk');
        if (missingFields.length) {
            return res.status(400).json({ error: "Missing required fields", missingFields });
        }
        const imageId = image_fk != null ? Number(image_fk) : null;
        const addressId = Address_fk != null ? Number(Address_fk) : null;
        let sqlQuery = "INSERT INTO profile (Profile_name, Profile_lastname, Profile_phone, Profile_number_document, User_fk, image_fk, Type_document_fk, Address_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await connect.query(sqlQuery, [Profile_name, Profile_lastname, Profile_phone, Profile_number_document, userId, imageId, typeDocId, addressId]);
        res.status(201).json({
            data: [{ id: result.insertId, Profile_name, Profile_lastname, Profile_phone, Profile_number_document, User_fk: userId, image_fk: imageId, Type_document_fk: typeDocId, Address_fk: addressId }],
            status: 201
        });
    } catch (error) {
        console.error('Error adding profile:', {
            body: req.body,
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState
        });
        // Manejar duplicados (teléfono, doc o perfil por usuario)
        if (error && error.code === 'ER_DUP_ENTRY') {
            const msg = String(error.sqlMessage || error.message || '').toLowerCase();
            let friendly = 'El valor ya está registrado';
            if (msg.includes('profile_phone')) friendly = 'El teléfono ya está registrado';
            else if (msg.includes('profile_number_document')) friendly = 'El número de documento ya está registrado';
            else if (msg.includes('user_fk') || msg.includes('user') && msg.includes('unique')) friendly = 'Este usuario ya tiene un perfil';
            return res.status(409).json({ error: friendly, details: error.sqlMessage || error.message, code: error.code });
        }
        res.status(500).json({ error: "Error adding profile", details: error.message, sqlMessage: error.sqlMessage, code: error.code });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { Profile_name, Profile_lastname, Profile_phone, Profile_number_document, User_fk, image_fk, Type_document_fk, Address_fk } = req.body;
        const missingFields = [];
        if (!Profile_name || !String(Profile_name).trim()) missingFields.push('Profile_name');
        if (!Profile_lastname || !String(Profile_lastname).trim()) missingFields.push('Profile_lastname');
        if (!Profile_phone || !String(Profile_phone).trim()) missingFields.push('Profile_phone');
        if (!Profile_number_document || !String(Profile_number_document).trim()) missingFields.push('Profile_number_document');
        const userId = Number(User_fk);
        if (!userId || Number.isNaN(userId)) missingFields.push('User_fk');
        const typeDocId = Number(Type_document_fk);
        if (!typeDocId || Number.isNaN(typeDocId)) missingFields.push('Type_document_fk');
        if (missingFields.length) {
            return res.status(400).json({ error: "Missing required fields", missingFields });
        }
        const imageId = image_fk != null ? Number(image_fk) : null;
        const addressId = Address_fk != null ? Number(Address_fk) : null;
        let sqlQuery = "UPDATE profile SET Profile_name=?, Profile_lastname=?, Profile_phone=?, Profile_number_document=?, User_fk=?, image_fk=?, Type_document_fk=?, Address_fk=? WHERE Profile_id=?";
        const [result] = await connect.query(sqlQuery, [Profile_name, Profile_lastname, Profile_phone, Profile_number_document, userId, imageId, typeDocId, addressId, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found"});
        res.status(200).json({
            data: [{ Profile_name, Profile_lastname, Profile_phone, Profile_number_document, User_fk: userId, image_fk: imageId, Type_document_fk: typeDocId, Address_fk: addressId }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        console.error('Error updating profile:', {
            params: req.params,
            body: req.body,
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState
        });
        if (error && error.code === 'ER_DUP_ENTRY') {
            const msg = String(error.sqlMessage || error.message || '').toLowerCase();
            let friendly = 'El valor ya está registrado';
            if (msg.includes('profile_phone')) friendly = 'El teléfono ya está registrado';
            else if (msg.includes('profile_number_document')) friendly = 'El número de documento ya está registrado';
            else if (msg.includes('user_fk') || msg.includes('user') && msg.includes('unique')) friendly = 'Este usuario ya tiene un perfil';
            return res.status(409).json({ error: friendly, details: error.sqlMessage || error.message, code: error.code });
        }
        res.status(500).json({ error: "Error updating profile", details: error.message, sqlMessage: error.sqlMessage, code: error.code });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM profile WHERE Profile_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting profile", details: error.message });
    }
};
