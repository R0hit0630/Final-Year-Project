import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDB } from "./config/db.js";
import destinationRoutes from "./routes/destination.routes.js";
import packageRoutes from "./routes/package.routes.js";
import bookingroutes from "./routes/bookingRoutes.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/api/destinations", destinationRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/users", authRoutes)

app.use("/api/booking", bookingroutes)
// connect to DB
connectDB();



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
