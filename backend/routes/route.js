import express from "express";
import { register, login, getMe, logout } from "../controller/user.controller.js";
import { 
  createPoll, 
  createQuiz, 
  respondToPoll, 
  attemptQuiz, 
  getPollById, 
  getQuizById,
  getMyPolls,
  pollStatusUpdate,
  getMyPollsResponses,
  getMyQuiz,
  quizStatusUpdate
} from "../controller/host.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, getMe);
router.post("/logout", verifyJWT, logout);

// polls
router.post("/polls", verifyJWT, createPoll);
router.get("/polls/:pollId", getPollById);
router.post("/polls/:pollId/respond", verifyJWT, respondToPoll);
router.get("/mypolls", verifyJWT, getMyPolls);
router.get("/mypolls/responses", verifyJWT, getMyPollsResponses);
router.patch("/polls/:pollId/status", pollStatusUpdate);


// quizzes
router.post("/quizzes", verifyJWT, createQuiz);
router.get("/quiz/:quizId", getQuizById);
router.post("/quizzes/:quizId/respond", verifyJWT, attemptQuiz);
router.patch("/quizzes/:quizId/status", quizStatusUpdate);
router.get("/myquiz", verifyJWT, getMyQuiz);

export default router;
