import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/api/users", authRoutes)


// connect to DB
connectDB();



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
