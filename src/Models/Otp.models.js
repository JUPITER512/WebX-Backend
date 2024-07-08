import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    otpExpire: {
        type: Date,
        required: true
    }
});

export const Otp = mongoose.model('Otp',otpSchema)