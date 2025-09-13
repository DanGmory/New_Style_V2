import { connect } from '../config/database.js';

export const showStateOrder = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM state_order";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching state_order", details: error.message });
    }
};

export const showStateOrderId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM state_order WHERE state_order_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "state order by id not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching state_order", details: error.message });
    }
};

export const addStateOrder = async (req, res) => {
    try {
        const { State_order_name } = req.body;
        if (!State_order_name)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO state_order (state_order_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ State_order_name ]);
        res.status(201).json({
            data: [{ id: result.insertId, State_order_name }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding state_order ", details: error.message });
    }
};

export const updateStateOrder = async (req, res) => {
    try {
        const { State_order_name } = req.body;
        if ( !State_order_name  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE state_order SET state_order_name=? WHERE State_order_id=?";
        const [result] = await connect.query(sqlQuery, [State_order_name, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "state_order not found"});
        res.status(200).json({
            data: [{ State_order_name }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating state_order", details: error.message });
    }
};

export const deleteStateOrder = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM state_order WHERE State_order_id= ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "state_order not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting state_order", details: error.message});
    }
};
