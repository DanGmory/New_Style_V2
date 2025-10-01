import { connect } from '../config/database.js';

export const showCompany = async (req, res) => {
    try {
        const [result] = await connect.query("SELECT * FROM company");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Company", details: error.message });
    }
};

export const showCompanyId = async (req, res) => {
    try {
        const [result] = await connect.query("SELECT * FROM company WHERE Company_id = ?", [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Company not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Company", details: error.message });
    }
};

export const addCompany = async (req, res) => {
    try {
        const { Company_name, Company_Address, Company_phone, Company_mail } = req.body;

        console.log("Datos recibidos para crear:", req.body);

        if (!Company_name || !Company_Address || !Company_phone || !Company_mail) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [result] = await connect.query(
            "INSERT INTO company (Company_name, Company_Address, Company_phone, Company_mail) VALUES (?, ?, ?, ?)",
            [Company_name, Company_Address, Company_phone, Company_mail]
        );

        console.log("Resultado del INSERT:", result);

        res.status(201).json({
            data: [{ id: result.insertId, Company_name, Company_Address, Company_phone, Company_mail}],
            status: 201
        });
    } catch (error) {
        console.error("ERROR DETALLADO EN ADD COMPANY:", error);
        res.status(500).json({ error: "Error adding Company", details: error.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { Company_name, Company_Address, Company_phone, Company_mail } = req.body;

        console.log("Datos recibidos para actualizar:", req.body);

        if (!Company_name || !Company_Address || !Company_phone || !Company_mail) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [result] = await connect.query(
            "UPDATE company SET Company_name = ?, Company_Address = ?, Company_phone = ?, Company_mail = ? WHERE Company_id = ?",
            [Company_name, Company_Address, Company_phone, Company_mail, req.params.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: "Company not found" });

        res.status(200).json({ status: 200, updated: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: "Error updating Company", details: error.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const [result] = await connect.query("DELETE FROM company WHERE Company_id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Company not found" });
        res.status(200).json({ status: 200, deleted: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Company", details: error.message });
    }
};
