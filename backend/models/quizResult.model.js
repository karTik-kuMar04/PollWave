import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedIndex: Number }],
    score: Number,
    maxScore: Number,
    passed: Boolean,
    attamptNumber: Number
}, { timestamps: true });

QuizResultSchema.index({ quiz: 1, user: 1 });
export const QuizResult = mongoose.model("QuizResult", QuizResultSchema);