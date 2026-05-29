const express = require("express");
const { getDb } = require("../db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { orderId, product, price, utr, date } = req.body;
  if (!orderId || !product || !price || !utr) {
    return res.status(400).json({ error: "Missing required fields: orderId, product, price, utr" });
  }
  try {
    const db = await getDb();
    const result = db.prepare(
      "INSERT INTO payments (order_id, product, price, utr, date, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(orderId, product, price, utr, date || new Date().toLocaleString("en-IN"), new Date().toISOString());
    res.status(201).json({
      success: true,
      id: result.lastInsertRowid,
      message: "Payment recorded successfully",
    });
  } catch (err) {
    if (err.message?.includes("UNIQUE") || err?.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      return res.status(409).json({ error: "Payment with this Order ID already exists" });
    }
    console.error("Payment insert error:", err);
    res.status(500).json({ error: "Failed to record payment" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const payments = db.prepare("SELECT * FROM payments ORDER BY id DESC").all();
    res.json({ payments });
  } catch (err) {
    console.error("Payment fetch error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.prepare("DELETE FROM payments WHERE id = ?").run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ success: true, message: "Payment deleted" });
  } catch (err) {
    console.error("Payment delete error:", err);
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

module.exports = router;
