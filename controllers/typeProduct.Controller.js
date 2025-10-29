import { connect } from '../config/database.js';


export const showTypeProduct = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM type_product";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Type_product", details: error.message });
    }
};

export const showTypeProductId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM type_product WHERE Type_product_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Size not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeProduct", details: error.message });
    }
};

export const addTypeProduct = async (req, res) => {
    try {
        const { Type_product_name, Type_product_category } = req.body;
        if (!Type_product_name || !Type_product_category)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO type_product (Type_product_name, Type_product_category) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [Type_product_name, Type_product_category]);
        res.status(201).json({
            data: [{ id: result.insertId, Type_product_name, Type_product_category }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeProduct", details: error.message });
    }
};

export const updateTypeProduct = async (req, res) => {
    try {
        const { Type_product_name, Type_product_category } = req.body;
        if ( !Type_product_name || !Type_product_category ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE type_product SET Type_product_name=?, Type_product_category=?  WHERE Type_product_id=?";
        const [result] = await connect.query(sqlQuery, [Type_product_name, Type_product_category, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "TypeProduct not found"});
        res.status(200).json({
            data: [{ Type_product_name, Type_product_category }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeProduct", details: error.message });
    }
};

export const deleteTypeProduct = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM type_product WHERE Type_product_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "TypeProduct not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Size", details: error.message});
    }
};
