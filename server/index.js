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

const JUDGE0_LANG = {
  python: 71,
  javascript: 63,
  java: 62,
  c: 50,
  cpp: 54,
};

app.post("/api/compile", async (req, res) => {
  const { language, version, code, files, stdin } = req.body;
  const content = code || (files && files[0] && files[0].content);
  if (!language || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const language_id = JUDGE0_LANG[language];
  if (!language_id) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  const apiKey = process.env.JUDGE0_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Code execution not configured. Set JUDGE0_API_KEY." });
  }

  try {
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: content,
          language_id,
          stdin: stdin || "",
        }),
      }
    );
    const data = await response.json();
    res.json({
      run: {
        stdout: data.stdout || "",
        stderr: data.stderr || data.compile_output || "",
        code: data.status ? (data.status.id <= 3 ? 0 : 1) : 1,
      },
    });
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
