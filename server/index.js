const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const workerRoutes = require("./routes/workers");
const ocrRoutes = require("./routes/ocr");
const adminRoutes = require("./routes/admin");
const translateRoutes = require("./routes/translate");
const campsRoutes = require("./routes/camps");
const doctorRoutes = require("./routes/doctor");

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/camps", campsRoutes);
app.use("/api/doctor", doctorRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ShramikCare Backend is running." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
