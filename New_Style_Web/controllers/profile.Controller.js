import { connect } from '../config/database.js';

// ==============================
// MOSTRAR TODOS LOS PERFILES
// ==============================
export const showProfile = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT
        P.Profile_id,
        P.Profile_name,
        P.Profile_lastname,
        P.Profile_phone,
        P.Profile_number_document,
        COALESCE(i.Image_url, '') AS Image_url,
        COALESCE(i.Image_name, '') AS Image_name,
        U.User_name, 
        U.User_mail, 
        U.User_password, 
        TD.Type_document_name,
        R.Role_name
      FROM profile P
      LEFT JOIN images i ON P.Image_fk = i.Image_id
      LEFT JOIN users U ON P.User_fk = U.User_id
      LEFT JOIN type_document TD ON P.Type_document_fk = TD.Type_document_id
      LEFT JOIN role R ON U.Role_fk = R.Role_id
    `;
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Profile", details: error.message });
  }
};

// ==============================
// MOSTRAR PERFIL POR ID
// ==============================
export const showProfileId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT
        P.Profile_id,
        P.Profile_name,
        P.Profile_lastname,
        P.Profile_phone,
        P.Profile_number_document,
        COALESCE(i.Image_url, '') AS Image_url,
        COALESCE(i.Image_name, '') AS Image_name,
        U.User_name,
        U.User_mail,
        U.User_password,
        TD.Type_document_name,
        R.Role_name
      FROM profile P
      LEFT JOIN images i ON P.Image_fk = i.Image_id
      LEFT JOIN users U ON P.User_fk = U.User_id
      LEFT JOIN type_document TD ON P.Type_document_fk = TD.Type_document_id
      LEFT JOIN role R ON U.Role_fk = R.Role_id
      WHERE P.Profile_id = ?
    `;
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("SQL Error:", error);
    res.status(500).json({ error: "Error fetching Profile", details: error.message });
  }
};

// ==============================
// AGREGAR PERFIL
// ==============================
export const addProfile = async (req, res) => {
  try {
    const {
      Profile_name,
      Profile_lastname,
      Profile_phone,
      Profile_number_document,
      User_fk,
      image_fk,
      Type_document_fk
    } = req.body;

    if (
      !Profile_name ||
      !Profile_lastname ||
      !Profile_phone ||
      !Profile_number_document ||
      !User_fk ||
      !Type_document_fk
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      INSERT INTO profile
      (Profile_name, Profile_lastname, Profile_phone, Profile_number_document, User_fk, image_fk, Type_document_fk)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connect.query(sqlQuery, [
      Profile_name,
      Profile_lastname,
      Profile_phone,
      Profile_number_document,
      User_fk,
      image_fk ? parseInt(image_fk) : null, // <-- Aquí ahora es NULL si no hay imagen
      Type_document_fk
    ]);

    res.status(201).json({
      data: [{
        id: result.insertId,
        Profile_name,
        Profile_lastname,
        Profile_phone,
        Profile_number_document,
        User_fk,
        image_fk: image_fk ? parseInt(image_fk) : null, // También lo reflejas en la respuesta
        Type_document_fk
      }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding Profile", details: error.message });
  }
};


// ==============================
// ACTUALIZAR PERFIL
// ==============================
export const updateProfile = async (req, res) => {
  try {
    const {
      Profile_name,
      Profile_lastname,
      Profile_phone,
      Profile_number_document,
      User_fk,
      image_fk,
      Type_document_fk
    } = req.body;

    const sqlQuery = `
      UPDATE profile
      SET Profile_name = ?, Profile_lastname = ?, Profile_phone = ?, Profile_number_document = ?, User_fk = ?, image_fk = ?, Type_document_fk = ?
      WHERE Profile_id = ?
    `;

    const [result] = await connect.query(sqlQuery, [
      Profile_name,
      Profile_lastname,
      Profile_phone,
      Profile_number_document,
      User_fk,
      image_fk,
      Type_document_fk,
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({
      data: [{
        Profile_name,
        Profile_lastname,
        Profile_phone,
        Profile_number_document,
        User_fk,
        image_fk,
        Type_document_fk
      }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Profile", details: error.message });
  }
};

// ==============================
// ELIMINAR PERFIL
// ==============================
export const deleteProfile = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM profile WHERE Profile_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Profile", details: error.message });
  }
};
