import express from "express";
import { register, login, getMe } from "../controller/user.controller.js";
import { createPoll, createQuiz, respondToPoll, attemptQuiz } from "../controller/host.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // we'll add a simple one below

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, getMe);


router.post("/polls)", verifyJWT, createPoll);
router.post("/quizzes", verifyJWT, createQuiz);

router.post("/polls/:pollId/respond", verifyJWT, respondToPoll);
router.post("/quizzes/:quizId/respond", verifyJWT, attemptQuiz);


export default router;
