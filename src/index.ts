import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import commonRoutes from "./routes/common.routes";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(helmet());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use((req, res, next) => {
  // if request comes with the '/api' prefix, then have to remove it.
  if (req.url.startsWith("/api")) {
    req.url = req.url.substring(4);
  }
  next();
});

app.use("/v1/users", userRoutes);
app.use("/v1/login", authRoutes);
app.use(commonRoutes);

// Start the express server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
