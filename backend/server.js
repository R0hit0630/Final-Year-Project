import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDB } from "./config/db.js";
import destinationRoutes from "./routes/destination.routes.js";
import packageRoutes from "./routes/package.routes.js";
import bookingroutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/destinations", destinationRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingroutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});