import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
})

const pollSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  options: [optionSchema],
  participants: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
  startAt: Date,
  endAt: Date,
  allowAnonymous: { type: Boolean, default: false },  // ✅ match controller
  maxVotesPerUser: { type: Number, default: 1 },
  settings: { type: mongoose.Schema.Types.Mixed, default: {type: "single-choice"} }, // ✅ type, not types
}, { timestamps: true });

pollSchema.index({ host: 1, createdAt: -1})

export const Poll = mongoose.model("Poll", pollSchema);