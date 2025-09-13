import { connect } from '../config/database.js';


export const showTypeDocument = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM type_document";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Type_document", details: error.message });
    }
};

export const showTypeDocumentId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM type_document WHERE Type_document_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Size not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching type_document", details: error.message });
    }
};

export const addTypeDocument = async (req, res) => {
    try {
        const { Type_document_name} = req.body;
        if (!Type_document_name)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO type_document (Type_document_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [Type_document_name]);
        res.status(201).json({
            data: [{ id: result.insertId, Type_document_name }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Typedocument", details: error.message });
    }
};

export const updateTypeDocument = async (req, res) => {
    try {
        const { Type_document_name } = req.body;
        if ( !Type_document_name) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE type_document SET Type_document_name=?  WHERE Type_document_id=?";
        const [result] = await connect.query(sqlQuery, [Type_document_name, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "TypeProduct not found"});
        res.status(200).json({
            data: [{ Type_document_name }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Type document", details: error.message });
    }
};

export const deleteTypeDocument = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM type_document WHERE Type_document_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Type document not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting type document", details: error.message});
    }
};
