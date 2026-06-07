const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

router.get("/pdfs", async (req, res) => {
  try {
    const db = await getDb();
    const pdfs = db.prepare("SELECT product_id, url FROM pdfs").all();
    const pdfMap = {};
    pdfs.forEach((p) => {
      pdfMap[p.product_id] = p.url;
    });
    res.json(pdfMap);
  } catch (err) {
    console.error("Fetch PDFs error:", err);
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

module.exports = router;
