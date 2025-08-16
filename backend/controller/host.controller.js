import mongoose from "mongoose";
import { Poll } from "../models/poll.model.js";
import { PollResponse } from "../models/pollResponce.model.js";
import { Quiz } from "../models/quiz.model.js";
import { QuizResult } from "../models/quizResult.model.js";
import { apiError } from "../utils/apiError.js";

/* --------------------------
   Create Poll (host only)
   POST /api/host/polls
   body: { title, description, type, options: [ "opt1", "opt2"... ], startAt?, endAt?, settings? }
----------------------------*/

export const createPoll = async (req, res, next) => {
    try {
        const { title, description, type = "single-choice", options = [], startAt, endAt, settings = {} } = req.body;

        if (!title || !Array.isArray(options) || options.length < 2) {
            throw new apiError(400, "Title and at least 2 options required");
        }

        const pollOptions = options.map(opt => ({ text: opt } ));

        const poll = await Poll.create({
            host: req.user._id,
            title,
            description,
            options: pollOptions,
            startAt,
            endAt,
            settings
        });

        return res.status(201).json({
            success: true,
            message: "Poll created successfully",
            poll
        });
    } catch (err) {
        next(err);
    }
}


/* --------------------------
   Respond to Poll
   POST /api/polls/:pollId/respond
   body: { selectedOptionIds: [optionId1, ...] }
----------------------------*/

export const respondToPoll = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();


    try {
        const { pollId } = req.params;
        const  { selectedOptionIds } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!Array.isArray(selectedOptionIds) || selectedOptionIds.length === 0) {
            throw new apiError(400, "no options selected");
        }

        // get poll
        const poll = await poll.findById(pollId).session(session);
        if (!poll) throw new apiError(404, "Poll not found");

        // check status/time
        if(poll.status !== "active") throw new apiError(400, "Poll is not active");
        const now = new Date();
        if (poll.startAt && poll.startAt > now) {
            throw new apiError(400, "poll has not started yet");
        }
        if (poll.endAt && poll.endAt < now) {
            throw new apiError(400, "poll has ended");
        }

        // if poll has maxVotesPerUser = 1 and user is authenticated, prevent repeat responses
        if (userId) {
            const already = await PollResponse.findOne({ poll: pollId, user: userId }).session(session);
            if (already) {
                throw new apiError(400, "User has already responded to this poll");
            }
        }

        // if anonymous responses are not allowed
        if (!poll.allowedAnonymous && !userId) {
            throw new apiError(401, "Authentication is required");
        }

        // create poll response
        const responseDoc = await PollResponse.create([{
            poll: pollId,
            user: userId || null,
            selectedOptionIds
        }], { session });

        // update votes and participantsCount atomically
        // for each selected option increment option.votes by 1
        const bulkUpdates = selectedOptionIds.map(optId => ({
            updateOne: {
                filter: { _id: poll._id, "options._id": optId },
                update: { $inc: { "options.$.votes": 1 } }
            }
        }));

        // increment participantsCount by 1
        bulkUpdates.push({
            updateOne: {
                dateOne: {
                    filter: { _id: poll._id },
                    update: { $inc: { participantsCount: 1 } }
                }
            }
        });

        // execute as one operation on Poll collection (not a mongoose transaction op,
        // but wrapped inside session for atomicity across docs when using transaction)

        await poll.bulkWrite(bulkUpdates, { session });

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            message: "Poll response recorded successfully",

        })
    } catch (err) {
       await session.abortTransaction();
        session.endSession();
        const status = err.status || 500;
        return next({ status, message: err.message || "Failed to record response" });
    }
}



/* --------------------------
   Create Quiz (host only)
   POST /api/host/quizzes
   body: { title, description, questions: [{ text, choices: [..], correctChoiceIndex, points? }], settings? }
----------------------------*/

export const createQuiz = async (req, res, next) => {
    try {
        const { title, description, questions = [], settings = {}, } = req.body;
        if (!title || !Array.isArray(questions) || questions.length === 0) {
            throw new apiError(400, "Title and at least one question required");
        }

        // for basic question validation
        for (const q of questions) {
            if (!q.text || !Array.isArray(q.choices) || q.choices.length < 2) {
                throw new apiError(400, "Each question must have text and at least 2 choices")
            }
        }

        const quiz = await Quiz.create({
            host: req.user._id,
            title,
            description,
            questions,
            settings
        })

        return res.status(201).json({ success: true, quiz });

    } catch (error) {
        next(error)
    }
}

/* --------------------------
   Attempt Quiz
   POST /api/quizzes/:quizId/attempt
   body: { answers: [{ questionId, selectedIndex }, ...] }
----------------------------*/


export const attemptQuiz = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { quizId } = req.params;
        const { answers = [] } = req.body;
        const userId = req.user ? req.user._id :  null;

        const quiz = await Quiz.findById(quizId).session(session);
        if(!quiz) throw new apiError(404, "Quiz not Found")
        if(quiz.status !== "active") throw new apiError(400, "Quiz is not active")
            
        // compute score
        let score = 0;
        let maxScore = 0;


        // map for question lookup
        const qMap = new Map();
        quiz.questions.forEach( q => {
            qMap.set(String(q.id), q)
        });

        for (const a of answers) {
            const q = qMap.get(String(a.questionId));
            if (!q) continue;
            maxScore += (q.points || 1);
            if (typeof a.selectedIndex !== "number") continue;
            if( a.selectedIndex === q.correctChoiceIndex) {
                score += (q.points || 1);
            }
        }

        const passed = ( quiz.setting.passScore != null ) ? ( score >= quiz.setting.passScore) : null;
        // determine attemptNumber (if User) -optional: limit attampts
        let attemptNumber = 1;
        if(userId) {
            const prevCount = await QuizResult.countDocuments({ quiz: quizId, user: userId }).session(session);
            attemptNumber = prevCount + 1
            if (quiz.setting.attemptsAllowed && prevCount >= quiz.setting.attemptsAllowed) {
                throw new apiError(403, "Attempt limit reached");
            }
        }

        // save QuizResult
        const result = await QuizResult.create([{
            quiz: quiz._id,
            user: userId || null,
            answers,
            score,
            maxScore,
            passed,
            attemptNumber
        }], {session});

        // increment participantsCount if first attempt for this user (or always if anonymous)
        if(!userId) { 
            await Quiz.updateOne({ _id: quizId }, { $inc: {participantsCount: 1 } }).session(session);
        }else{
            // only increment if first attempt
            if(attemptNumber === 1) {
                await  Quiz.updateOne({ _id: quizId }, { $inc: {participantsCount: 1 } }).session(session);
        }
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ success: true, result: result[0] });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        const status = err.status || 500;
        return next({ status, message: err.message || "Failed to submit quiz" });
    }
}