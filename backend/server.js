const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
