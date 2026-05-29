require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { getDb, persistDb } = require("./db");
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

app.post("/api/compile", async (req, res) => {
  const { language, version, code, files, stdin } = req.body;
  const content = code || (files && files[0] && files[0].content);
  if (!language || !version || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ content }],
        stdin: stdin || "",
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Compile error:", err);
    res.status(502).json({ error: "Code execution service unavailable" });
  }
});

const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  getDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
