import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export const Chat = mongoose.model('Chat', ChatSchema);