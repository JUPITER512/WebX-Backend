import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDatabase=async()=>{
    try{
        const responseObject =await mongoose.connect(`${process.env.DATABASE_CONNECTION_STRING}${DB_NAME}`);
        console.log("\t\n Database connect to the host ",responseObject.connection.host)
    }catch(error){
        console.log("Error Occure While Connection to Database",error);
        process.exit(1)
    }
}