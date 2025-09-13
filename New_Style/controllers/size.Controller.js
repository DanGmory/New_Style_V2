import { connect } from '../config/database.js';


export const showSize = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM size";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Size", details: error.message });
    }
};

export const showSizeId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM size WHERE Size_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Size not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Size", details: error.message });
    }
};

export const addSize = async (req, res) => {
    try {
        const { Size_name } = req.body;
        if (!Size_name)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO size (Size_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ Size_name ]);
        res.status(201).json({
            data: [{ id: result.insertId, Size_name }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Size ", details: error.message });
    }
};

export const updateSize = async (req, res) => {
    try {
        const { Size_name } = req.body;
        if ( !Size_name ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE size SET Size_name=?  WHERE Size_id=?";
        const [result] = await connect.query(sqlQuery, [Size_name, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Size not found"});
        res.status(200).json({
            data: [{ Size_name }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Size", details: error.message });
    }
};

export const deleteSize = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM size WHERE Size_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Size not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Size", details: error.message});
    }
};
