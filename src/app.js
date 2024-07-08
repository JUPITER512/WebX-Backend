import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
export const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:'16kb'}));
app.use(cookieParser());
app.use(express.static('Public'))

import { userRouter } from './Routes/User.routes.js';

app.use('/api/v1/user',userRouter);