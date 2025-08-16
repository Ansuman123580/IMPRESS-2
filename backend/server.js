import 'dotenv/config'; 
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*", // Development: allow all origins; change in production
    credentials: true
}));

// Database connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

// Default route
app.get("/", (req, res) => {
    res.send("API working ✅");
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
});
