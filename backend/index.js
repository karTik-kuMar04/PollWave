import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

import router from "./routes/route.js";
app.use(router);

connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => console.log(`Server is running at port : ${process.env.PORT}`));
});
