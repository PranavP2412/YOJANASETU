import express from "express";
import  dotenv from "dotenv";

const app = express();

dotenv.config({
    path:"./.env"
})

app.get("/",(req,res)=>{
    return res.json({message:"Hii from yojanasetu"});
})

app.listen(process.env.PORT,()=>{
    console.log("server is running on port 8000!!")
})
