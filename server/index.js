require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { getDb } = require("./db");
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payments");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Code compile proxy (Piston API)
app.post("/api/compile", async (req, res) => {
  const { language, version, code, stdin } = req.body;
  if (!language || !version || !code) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: code }],
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

// Serve React build in production
const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Init DB and start server
getDb();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Admin login: POST /api/auth/login`);
});
