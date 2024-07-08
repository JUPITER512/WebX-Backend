import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        uppercase: true
    },
    lastName: {
        type: String,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        index: true
    },
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        index: true
    },
    profilePicture: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },
    confirmToken: {
        type: String
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
});
userSchema.pre('save',async function(next){
    if (this.isModified('password')){
        this.password= await bcrypt.hash(this.password,10);
        next()
    }
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model('User',userSchema)

// mongoose.plugin(mongooseAggregatePaginate)