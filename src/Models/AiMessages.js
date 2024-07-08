import mongoose from "mongoose";

const AISchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    aiResponse: {
        type: String,
        required: true,
    },
    isUser:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

export const AIResponse = mongoose.model('AIResponse', AISchema);