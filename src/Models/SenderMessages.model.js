import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isUser: {
        type: Boolean,
        default: true,
    }
},{timestamps:true});

export const Message = mongoose.model('Message', MessageSchema);
