import { connect } from '../config/database.js';

export const showAddressProfile = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM Address_profile";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Address_profile", details: error.message });
    }
};

export const showAddressProfileId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM Address_profile WHERE Address_profile_id=?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Address_profile not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Address_profile", details: error.message });
    }
};

export const addAddressProfile = async (req, res) => {
    try {
        const { Address_fk, Profile_fk } = req.body;
        if (!Address_fk|| !Profile_fk )  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO address_profile (Address_fk, Profile_fk) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [Address_fk, Profile_fk]);
        res.status(201).json({
            data: [{ id: result.insertId, Address_fk, Profile_fk}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Address_profile ", details: error.message });
    }
};

export const updateAddressProfile = async (req, res) => {
    try {
        const {Address_fk, Profile_fk } = req.body;
        if ( !Address_fk || !Profile_fk ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE address_profile SET Address_fk=?, Profile_fk=?  WHERE Address_profile_id=?";
        const [result] = await connect.query(sqlQuery, [Address_fk, Profile_fk, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Direccion not found"});
        res.status(200).json({
            data: [{ Address_fk, Profile_fk }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Address_profile", details: error.message });
    }
};

export const deleteAddressProfile = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM Address_profile WHERE Address_profile_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Address_profile not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Address_profile", details: error.message});
    }
};
