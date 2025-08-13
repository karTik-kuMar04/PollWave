import express from "express";
import { register, login, getMe } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // we'll add a simple one below

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, getMe);

export default router;
