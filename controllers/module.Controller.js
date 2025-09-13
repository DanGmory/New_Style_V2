import { connect } from '../config/database.js';


export const showModule = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM module";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching module", details: error.message });
    }
};

export const showModuleId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM module WHERE Module_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "module not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Module", details: error.message });
    }
};

export const addModule = async (req, res) => {
    try {
        const { Module_name, Module_description, Module_route } = req.body;
        if (!Module_name || !Module_description || !Module_route )  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO module (Module_name, Module_description, Module_route) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [ Module_name, Module_description, Module_route ]);
        res.status(201).json({
            data: [{ id: result.insertId, Module_name, Module_description, Module_route}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Module ", details: error.message });
    }
};

export const updateModule = async (req, res) => {
    try {
        const {Module_name, Module_description, Module_route} = req.body;
        if (!Module_name || !Module_description || !Module_route) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE module SET Module_name=?, Module_description=?, Module_route=?  WHERE Module_id=?";
        const [result] = await connect.query(sqlQuery, [Module_name, Module_description, Module_route, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Module not found"});
        res.status(200).json({
            data: [{ Module_name, Module_description, Module_route }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Module", details: error.message });
    }
};

export const deleteModule = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM module WHERE Module_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Module not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Module", details: error.message});
    }
};
