const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getDb, persistDb } = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "tcsnqt-secret-key-change-in-prod";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

router.post("/upload-pdf", authMiddleware, async (req, res) => {
  try {
    const { productId, url } = req.body;
    if (!productId || !url) {
      return res.status(400).json({ error: "productId and url are required" });
    }
    const db = await getDb();
    const existing = db.prepare("SELECT * FROM pdfs WHERE product_id = ?").get(productId);
    if (existing) {
      db.prepare("UPDATE pdfs SET url = ?, uploaded_at = datetime('now') WHERE product_id = ?").run(url, productId);
    } else {
      db.prepare("INSERT INTO pdfs (product_id, url) VALUES (?, ?)").run(productId, url);
    }
    persistDb();
    res.json({ success: true, message: "PDF URL updated successfully" });
  } catch (err) {
    console.error("Upload PDF error:", err);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
});

router.get("/pdfs", authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const pdfs = db.prepare("SELECT * FROM pdfs ORDER BY product_id").all();
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

module.exports = router;
