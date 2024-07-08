import { Router } from "express";
import { Logout, SignIn, SignUp, changeInformation, changePassowrd, changeProfilePicture, forgetPasswordEmailVerification, refreshAccessToken, verifyEmail, verifyOtp } from "../Controllers/User.Controller.js";

import { aiGenerate, delete_chat, getSpecificChat, getUserChat } from '../Controllers/Ai.controller.js'
import { upload } from "../Middlewares/multer.middleware.js";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
Logout
export const userRouter = Router();
userRouter.post("/signIn", SignIn);
userRouter.post(
  "/signup",
  upload.single('Image'),
  SignUp,
);
userRouter.post('/refreshAccessToken',refreshAccessToken)
userRouter.post('/logout',verifyJwt,Logout)
userRouter.get('/confirm-email',verifyEmail)
userRouter.post('/getOtp',forgetPasswordEmailVerification)
userRouter.post('/verifyOtp',verifyOtp)
userRouter.post('/submitNewPassword',changePassowrd)
userRouter.put('/change_information',verifyJwt,changeInformation)
userRouter.put('/change_profilePicture', verifyJwt, upload.single('Image'),changeProfilePicture)

userRouter.post('/generateMessage',verifyJwt,aiGenerate)
userRouter.get('/get_user_chat_ids',verifyJwt,getUserChat)
userRouter.get('/get_chat',verifyJwt,getSpecificChat)
userRouter.delete('/delete_chat', verifyJwt, delete_chat)
