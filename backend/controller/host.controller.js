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


        const populatedPoll = await Poll.findById(poll._id)
            .populate("host", "fullName email");


        return res.status(201).json({
            success: true,
            message: "Poll created successfully",
            poll: populatedPoll
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
    let { selectedOptionIds, selectedOption } = req.body;
    const userId = req.user ? req.user._id : null;

    if (selectedOption && !selectedOptionIds) {
      selectedOptionIds = [selectedOption];
    }

    if (!Array.isArray(selectedOptionIds) || selectedOptionIds.length === 0) {
      throw new apiError(400, "No options selected");
    }


    const pollDoc = await Poll.findById(pollId).session(session);
    if (!pollDoc) throw new apiError(404, "Poll not found");

    if (pollDoc.status !== "active") throw new apiError(400, "Poll is not active");

    const now = new Date();
    if (pollDoc.startAt && pollDoc.startAt > now) {
      throw new apiError(400, "Poll has not started yet");
    }
    if (pollDoc.endAt && pollDoc.endAt < now) {
      throw new apiError(400, "Poll has ended");
    }

    if (userId) {
      const already = await PollResponse.findOne({ poll: pollId, user: userId }).session(session);
      if (already) throw new apiError(400, "User has already responded to this poll");
    }


    await PollResponse.create(
      [
        {
          poll: pollId,
          user: userId || null,
          selectedOptionIds,
        },
      ],
      { session }
    );


    const bulkUpdates = selectedOptionIds.map((optId) => ({
      updateOne: {
        filter: { _id: pollDoc._id, "options._id": optId },
        update: { $inc: { "options.$.votes": 1 } },
      },
    }));

    // increment participantsCount
    bulkUpdates.push({
      updateOne: {
        filter: { _id: pollDoc._id },
        update: { $inc: { participants: 1 } },
      },
    });

    await Poll.bulkWrite(bulkUpdates, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Poll response recorded successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in respondToPoll:", err);
    const status = err.status || 500;
    return next({ status, message: err.message || "Failed to record response" });
  }
};



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
        
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Quiz Attempt Error:", err);
        const status = err.status || 500;
        return next({ status, message: err.message || "Failed to submit quiz" });
    }
}




export const getPollById = async (req, res, next) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId).populate("host", "fullName email"); // 👈 populate host info     

    if (!poll) {
      throw new apiError(404, "Poll not found");
    }

    return res.status(200).json({
      success: true,
      poll
    });
  } catch (err) {
    next(err);
  }
};


export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("host", "fullName email");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





export const getMyPolls = async (req, res, next) => {
  try {
    const hostId = req.user._id; //from auth middleware

    const polls = await Poll.find({ host: hostId })
      .sort({createdAt: -1})
      .select("title status participants createdAt")

    

    res.status(200).json({
      success: true,
      polls,
    });
  } catch (err) {
    next({ status: 500, message: err.message || "Failed to fetch polls" });
  }
}

export const getMyQuiz = async (req, res, next) => {
  try {
    const hostId = req.user._id; //from auth middleware
    const quizzes = await Quiz.find({ host: hostId })
      .sort({ createdAt: -1 })
      .select("title status participantsCount createdAt");

    

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (err) {
    next({ status: 500, message: err.message || "Failed to fetch quizzes"
    });
  }
}





export const pollStatusUpdate = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { status } = req.body;

    if (!["draft", "active", "closed"].includes(status)) {
      return next({ status: 400, message: "Invalid status" });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    // prevent reopening once closed
    if (poll.status === "closed") {
      return res
        .status(400)
        .json({ success: false, message: "Poll is already closed and cannot be changed." });
    }

    poll.status = status;
    await poll.save();

    const updatedPoll = await Poll.findById(pollId).populate("host", "fullName email");

    res.status(200).json({ success: true, poll: updatedPoll });
  } catch (error) {
    next(error);
  }
};

export const quizStatusUpdate = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { status } = req.body;
    if (!["draft", "active", "closed"].includes(status)) {
      return next({ status: 400, message: "Invalid status" });
    }
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { status },
      { new: true }
    ).populate("host", "name email");

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
}


export const getMyPollsResponses = async (req, res, next) => {
  try {
    const participantId = req.user?._id;
    
    if (!participantId) {
      throw new apiError(401, "Unauthorized access");
    }

   const responseOnPoll = await PollResponse.find({ user: participantId })
    .sort({ createdAt: -1 })
    .populate("poll", "title options status")
    .select("selectedOptionIds createdAt poll");


    res.status(200).json({
      success: true,
      responseOnPoll,
    });

  } catch (error) {
    console.error("Error in /poll-responses:", error.message);
    console.error(error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }

}


export const getMyResonponseOnQuiz = async (req, res, next) => {
  try {
    const participantId = req.user?._id;
    
    if (!participantId) {
      throw new apiError(401, "Unauthorized access");
    }

    const responceOnQuiz = await QuizResult.find({ user: participantId })
      .sort({ createdAt: -1 })
      .populate("quiz", "title questions")
      .select("score maxScore passed attemptNumber createdAt quiz");


    res.status(200).json({
      success: true,
      responceOnQuiz,
    });
  } catch (error) {
    console.error("Error in /quiz-responses:", error.message);
    console.error(error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
}





export const getQuizResult = async (req, res) => {
  try {
    const { quizId, resultId } = req.params;

    // Make sure quizId and userId are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({ message: "Invalid quizId or userId" });
    }

    const result = await QuizResult.findOne({
      _id: resultId,
      quiz: quizId,
    })
      .populate({
        path: "quiz",
        select: "title description questions",
        populate: {
          path: "questions",
          select: "questionText options correctAnswer"
        }
      });


    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("getQuizResult error:", err);
    res.status(500).json({ message: "Failed to fetch quiz result" });
  }
};





export const getPollResults = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if user is host
    const isHost = String(poll.host) === String(req.user?._id);

    // Restrict participants until poll is closed
    if (poll.status !== "closed" && !isHost) {
      return res.status(403).json({ message: "Results are only visible after completion" });
    }

    // Count responses
    const responses = await PollResponse.find({ poll: pollId });

    const counts = {};
    poll.options.forEach((opt) => {
      counts[opt._id.toString()] = 0;
    });

    responses.forEach((resp) => {
      resp.selectedOptionIds.forEach((optId) => {
        counts[optId] = (counts[optId] || 0) + 1;
      });
    });

    const results = poll.options.map((opt) => ({
      _id: opt._id,
      text: opt.text,
      votes: counts[opt._id.toString()] || 0,
    }));

    res.json({
      pollId: poll._id,
      title: poll.title,
      description: poll.description,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch poll results" });
  }
};
