import mongoose from "mongoose";

const ChoiceSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    text: String
});


const QuestionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    text: { type: String, required: true},
    choices: [ChoiceSchema],
    correctChoiceIndex: { type: Number, required: true },
    points: { type: Number, default: 1 }
})

const quizSchema = new mongoose.Schema({
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema],
    setting: { type: mongoose.Schema.Types.Mixed, default: {} },
    participantsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
},{ timestamps: true})

quizSchema.index({ host: 1, createdAt: -1 });

export const Quiz = mongoose.model("Quiz", quizSchema);

