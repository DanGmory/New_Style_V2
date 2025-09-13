import { connect } from '../config/database.js';

export const showColors = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM color";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching color", details: error.message });
    }
};

export const showColorsId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM color WHERE Color_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Races not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching color", details: error.message });
    }
};

export const addColors = async (req, res) => {
    try {
        const { Color_name  } = req.body;
        if (!Color_name) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO color (Color_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [Color_name]);
        res.status(201).json({
            data: [{ id: result.insertId, Color_name}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding color", details: error.message });
    }
};

export const updateColors = async (req, res) => {
    try {
        const { Color_name} = req.body;
        if ( !Color_name ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE color SET Color_name=? WHERE Color_id=?";
        const [result] = await connect.query(sqlQuery, [Color_name, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Color not found"});
        res.status(200).json({
            data: [{ Color_name }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating color", details: error.message });
    }
};

export const deleteColors = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM color WHERE Color_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Color not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting color", details: error.message});
    }
};
