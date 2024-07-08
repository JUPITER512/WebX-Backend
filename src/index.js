import { app } from "./app.js";
import { connectDatabase } from "./DB/Db.js";

connectDatabase().then((res)=>{

    app.on('error',(error)=>{
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`Application/Server Started on port ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log("Mongo Databse Connection Failed in index.js",error)
})