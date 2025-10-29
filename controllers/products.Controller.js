import { connect } from '../config/database.js';

// Listar todos los productos con imagen
export const showProducts = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        p.Product_id,
        p.Product_name,
        p.Product_amount,
        p.Product_category,
        p.Product_description,
        p.price,
        COALESCE(i.Image_url, '') AS Image_url,
        COALESCE(i.Image_name, '') AS Image_name,
        b.Brand_name,
        c.Color_name,
        s.Size_name,
        tp.Type_product_name
      FROM product p
      LEFT JOIN images i ON p.Image_fk = i.Image_id
      LEFT JOIN brand b ON p.Brand_fk = b.Brand_id
      LEFT JOIN color c ON p.Color_fk = c.Color_id
      LEFT JOIN size s ON p.Size_fk = s.Size_id
      LEFT JOIN type_product tp ON p.Type_product_fk = tp.Type_product_id
    `;
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching productos", details: error.message });
  }
};

// Obtener producto por ID
export const showProductsId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        p.Product_id,
        p.Product_name,
        p.Product_amount,
        p.Product_category,
        p.Product_description,
        p.price,
        COALESCE(i.Image_url, '') AS Image_url,
        COALESCE(i.Image_name, '') AS Image_name,
        b.Brand_name,
        c.Color_name,
        s.Size_name,
        tp.Type_product_name
      FROM product p
      LEFT JOIN images i ON p.Image_fk = i.Image_id
      LEFT JOIN brand b ON p.Brand_fk = b.Brand_id
      LEFT JOIN color c ON p.Color_fk = c.Color_id
      LEFT JOIN size s ON p.Size_fk = s.Size_id
      LEFT JOIN type_product tp ON p.Type_product_fk = tp.Type_product_id
      WHERE p.Product_id = ?
    `;
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.length === 0) return res.status(404).json({ error: "Producto not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching producto", details: error.message });
  }
}
// Crear producto
export const addProducts = async (req, res) => {
  try {
    const { Name, Amount, category, description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk } = req.body;

    if (!Name || !Amount || !category || !description || !price || !Image_fk || !Brand_fk || !Color_fk || !Size_fk || !Type_product_fk) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      INSERT INTO product (
        Product_name, Product_amount, Product_category,
        Product_description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connect.query(sqlQuery, [
      Name, Amount, category, description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk
    ]);

    res.status(201).json({
      data: [{ id: result.insertId, Name, Amount, category, description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding product", details: error.message });
  }
};
// Actualizar producto
export const updateProducts = async (req, res) => {
  try {
    const { Name, Amount, category, description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk } = req.body;

    if (!Name || !Amount || !category || !description || !price || !Image_fk || !Brand_fk || !Color_fk || !Size_fk || !Type_product_fk) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      UPDATE product
      SET Product_name=?, Product_amount=?, Product_category=?,
          Product_description=?, price=?, Image_fk=?, Brand_fk=?, Color_fk=?, Size_fk=?, Type_product_fk=?
      WHERE Product_id=?
    `;

    const [result] = await connect.query(sqlQuery, [
      Name, Amount, category, description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk, req.params.id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({
      data: [{ Name, Amount, category, description, price, Image_fk, Brand_fk, Color_fk, Size_fk, Type_product_fk }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating product", details: error.message });
  }
};
// Eliminar producto
export const deleteProducts = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM product WHERE Product_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Producto not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting producto", details: error.message });
  }
};

// Listar marcas
export const getBrands = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT Brand_id, Brand_name FROM brand");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching brands", details: error.message });
  }
};

// Listar colores
export const getColors = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT Color_id, Color_name FROM color");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching colors", details: error.message });
  }
};

// Listar tallas
export const getSizes = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT Size_id, Size_name FROM size");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sizes", details: error.message });
  }
};

// Listar tipos de productos
export const getTypeProducts = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT Type_product_id, Type_product_name FROM type_product");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching type products", details: error.message });
  }
};
