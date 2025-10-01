import { connect } from '../config/database.js';


export const showRole = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM role ";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching role", details: error.message });
    }
};

export const showRoleId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM role WHERE Role_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Role not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Role", details: error.message });
    }
};

export const addRole = async (req, res) => {
    try {
        const { Role_name } = req.body;
        if (!Role_name)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO role (Role_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ Role_name ]);
        res.status(201).json({
            data: [{ id: result.insertId, Role_name }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding role ", details: error.message });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { Role_name } = req.body;
        if ( !Role_name ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE role SET Role_name=?  WHERE Role_id=?";
        const [result] = await connect.query(sqlQuery, [Role_name, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Role not found"});
        res.status(200).json({
            data: [{ Role_name }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating role", details: error.message });
    }
};

export const deleteRole = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM role WHERE Role_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Role not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting role", details: error.message});
    }
};
