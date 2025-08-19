import mongoose from "mongoose";

const PollResponseSchema = new mongoose.Schema({
    poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    selectedOptionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
    metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: {createdAt: true , updatedAt: false }});


PollResponseSchema.index({ poll: 1, user: 1 }, { unique: false });
export const PollResponse = mongoose.model("PollResponse", PollResponseSchema);