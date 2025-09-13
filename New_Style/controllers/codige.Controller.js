import { connect } from '../config/database.js';

export const showCodige = async (req, res) => {
   try {
        let sqlQuery=   
        `
        SELECT
            O.Orders_id,
            PD.Product_name AS product_name,
            PD.Product_amount AS product_amount,
            PD.price AS price,
            IMG.Image_url AS image_url,
            US.User_name AS user_name,
            CP.Company_name AS company_name
        FROM orders O
        INNER JOIN product PD ON O.Product_fk = PD.Product_id
        INNER JOIN images IMG ON PD.Image_fk = IMG.Image_id
        INNER JOIN users US ON O.User_fk = US.User_id
        INNER JOIN company CP ON US.Company_fk = CP.Company_id
        `;
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching codige", details: error.message });
    }
};

export const showCodigeId = async (req, res) => {
    try {
        const sqlQuery =
        `
        SELECT
            O.Orders_id,
            PD.Product_name AS product_name,
            PD.Product_amount AS product_amount,
            PD.price AS price,
            IMG.Image_url AS image_url,
            US.User_name AS user_name,
            CP.Company_name AS company_name
        FROM orders O
        INNER JOIN product PD ON O.Product_fk = PD.Product_id
        INNER JOIN images IMG ON PD.Image_fk = IMG.Image_id
        INNER JOIN users US ON O.User_fk = US.User_id
        INNER JOIN company CP ON US.Company_fk = CP.Company_id
        WHERE O.Orders_id=?
        `;
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "codige not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching codige", details: error.message });
    }
};

export const addCodige = async (req, res) => {
    try {
        const { Codige_number, Orders_fk } = req.body;
        if (!Codige_number || !Orders_fk) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO codige (Codige_number, Orders_fk) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [ Codige_number, Orders_fk]);
        res.status(201).json({
            data: [{ id: result.insertId, Codige_number, Orders_fk}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding codige", details: error.message });
    }
};

export const updateCodige = async (req, res) => {
    try {
        const { Codige_number, Orders_fk } = req.body;
        /*if ( Codige_number, Orders_fk ) {
            return res.status(400).json({ error: "Missing required fields "});
        }*/
        let sqlQuery = "UPDATE codige SET Codige_number=?, Orders_fk=? WHERE Codige_id=?";
        const [result] = await connect.query(sqlQuery, [Codige_number, Orders_fk, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "codiget not found"});
        res.status(200).json({
            data: [{ Codige_number, Orders_fk}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating codige", details: error.message });
    }
};

export const deleteCodige = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM codige WHERE Orders_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "codige not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting codige", details: error.message});
    }
};
