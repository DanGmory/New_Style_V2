import { connect } from '../config/database.js';

// Genera un código único para la orden combinando fecha (YYMMDD), id en base36 y un sufijo aleatorio
function generateOrderCode(orderId) {
    const now = new Date();
    const y = String(now.getFullYear()).slice(2); // YY
    const m = String(now.getMonth() + 1).padStart(2, '0'); // MM
    const d = String(now.getDate()).padStart(2, '0'); // DD
    const date = `${y}${m}${d}`;
    const id36 = Number(orderId).toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `OD${date}-${id36}-${rand}`;
}

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
            SO.State_order_name AS state_order_name,
	        CP.Company_name AS company_name,
            CO.Codige_number AS codige_number
        FROM orders O
        INNER JOIN product PD ON O.Product_fk = PD.Product_id
        INNER JOIN images IMG ON PD.Image_fk = IMG.Image_id
        INNER JOIN users US ON O.User_fk = US.User_id
        INNER JOIN state_order SO on O.State_order_fk = SO.State_order_id
        INNER JOIN company CP ON US.Company_fk = CP.Company_id
        LEFT JOIN codige CO ON CO.Orders_fk = O.Orders_id
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
            SO.State_order_name AS state_order_name,
	        CP.Company_name AS company_name,
            CO.Codige_number AS codige_number
        FROM orders O
        INNER JOIN product PD ON O.Product_fk = PD.Product_id
        INNER JOIN images IMG ON PD.Image_fk = IMG.Image_id
        INNER JOIN users US ON O.User_fk = US.User_id
        INNER JOIN state_order SO on O.State_order_fk = SO.State_order_id
        INNER JOIN company CP ON US.Company_fk = CP.Company_id
        LEFT JOIN codige CO ON CO.Orders_fk = O.Orders_id
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
    const { Product_fk, User_fk, State_order_fk } = req.body;
    if (!Product_fk || !User_fk || !State_order_fk) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    let conn;
    try {
        conn = await connect.getConnection();
        await conn.beginTransaction();

        const [orderResult] = await conn.query(
            "INSERT INTO orders (Product_fk, User_fk, State_order_fk) VALUES (?,?,?)",
            [Product_fk, User_fk, State_order_fk]
        );
        const orderId = orderResult.insertId;

        const code = generateOrderCode(orderId);
        await conn.query(
            "INSERT INTO codige (Codige_number, Orders_fk) VALUES (?,?)",
            [code, orderId]
        );

        await conn.commit();
        res.status(201).json({
            data: [{ id: orderId, Product_fk, User_fk, State_order_fk, Codige_number: code }],
            status: 201
        });
    } catch (error) {
        if (conn) {
            try { await conn.rollback(); } catch {}
        }
        res.status(500).json({ error: "Error adding orders", details: error.message });
    } finally {
        if (conn) conn.release();
    }
};

export const updateOrders = async (req, res) => {
    try {
        const { Product_fk, User_fk, State_order_fk } = req.body;
        if ( !Product_fk || !User_fk || !State_order_fk ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
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
