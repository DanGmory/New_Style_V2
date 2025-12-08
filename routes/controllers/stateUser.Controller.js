import { connect } from '../config/database.js';

export const showStateUser = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM state_user";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching state_user", details: error.message });
    }
};

export const showStateUserId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM state_user WHERE State_user_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "state user not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching state user", details: error.message });
    }
};

export const addStateUser = async (req, res) => {
    try {
        const { State_user_name } = req.body;
        if (!State_user_name)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO state_user (State_user_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ State_user_name ]);
        res.status(201).json({
            data: [{ id: result.insertId, State_user_name }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding state_user ", details: error.message });
    }
};

export const updateStateUser = async (req, res) => {
    try {
        const { State_user_name } = req.body;
        if ( !State_user_name  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE state_user SET State_user_name=? WHERE State_user_id=?";
        const [result] = await connect.query(sqlQuery, [State_user_name, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "state_user not found"});
        res.status(200).json({
            data: [{ State_user_name }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating state_user", details: error.message });
    }
};

export const deleteStateUser = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM state_user WHERE State_user_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "state_user not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting state_user", details: error.message});
    }
};
