import jwt from 'jsonwebtoken';
import {Asynchandler} from '../Utils/AsyncHandler.js'
import {User} from '../Models/User.models.js'
export const verifyJwt=Asynchandler(async(req,res,next)=>{
    try{
        const requestedJwt = req.cookies ?. accessToken || req.headers.authorization.split(' ')[1]
        if(!requestedJwt){
            res.status(404).json({
                message: "Unauthorize Request"
            })
        }
        const decodedInfo =  jwt.decode(requestedJwt, process.env.ACCESS_TOKEN_SECRET);
        const user=await User.findById(decodedInfo?._id).select("-password -refreshToken");
        if(!user){
            res.status(400).json({
                message:"Invalid Access Token"
            })
            return
        }
        req.user=user;
        next()
    }catch(error){
        res.status(400).json({
            message:error.message || "Invalid Token"
        })
    }
    })