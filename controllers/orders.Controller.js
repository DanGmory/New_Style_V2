import { connect } from '../config/database.js';

export const showOrders = async (req, res) => {
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
        res.status(500).json({ error: "Error fetching orders", details: error.message });
    }
};

export const showOrdersId = async (req, res) => {
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
        if (result.length === 0) return res.status(404).json({ error: "orders not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching orders", details: error.message });
    }
};

export const addOrders = async (req, res) => {
    try {
        const { Product_fk, User_fk, State_order_fk } = req.body;
        if (!Product_fk || !User_fk || !State_order_fk) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO orders (Product_fk, User_fk, State_order_fk) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [ Product_fk, User_fk, State_order_fk]);
        res.status(201).json({
            data: [{ id: result.insertId, Product_fk, User_fk, State_order_fk}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding orders", details: error.message });
    }
};

export const updateOrders = async (req, res) => {
    try {
        const { Product_fk, User_fk, State_order_fk } = req.body;
        /*if ( Product_fk, User_fk, State_order_fk ) {
            return res.status(400).json({ error: "Missing required fields "});
        }*/
        let sqlQuery = "UPDATE orders SET Product_fk=?, User_fk=?, State_order_fk=? WHERE Orders_id=?";
        const [result] = await connect.query(sqlQuery, [Product_fk, User_fk, State_order_fk, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "orderst not found"});
        res.status(200).json({
            data: [{ Product_fk, User_fk, State_order_fk}],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating orders", details: error.message });
    }
};

export const deleteOrders = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM orders WHERE Orders_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "orders not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting orders", details: error.message});
    }
};
