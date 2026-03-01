import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import otpRoutes from "./routes/otpRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import SubmissionRoutes from "./routes/round1SubmissionRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));

// Routes
const mainRouter = express.Router();

// Health check
mainRouter.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

mainRouter.use("/api/admin", adminRoutes);
mainRouter.use("/api/otp", otpRoutes);
mainRouter.use("/", SubmissionRoutes);


app.use("/kriyabe", mainRouter);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
