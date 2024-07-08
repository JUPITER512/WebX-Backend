import mongoose from "mongoose";
const socialSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    provider:{
        type:String,
        enum:['google','facebook','github'],
        required:true
    },
    providerId:{
        type:String,
        required:true
    }
})

export const Social=mongoose.model('Social',socialSchema)