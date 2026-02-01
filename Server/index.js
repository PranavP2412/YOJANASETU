import express, { urlencoded } from "express";
import  dotenv from "dotenv";
import authRouter from "./src/routes/auth.routes.js";
import cors from "cors";
import connectDB from "./src/db/index.js";
import  healthCheckRouter  from "./src/routes/healthcheck.routes.js";
import cookieParser from "cookie-parser";
import userInfoRouter from "./src/routes/userInfo.routes.js"
import schemesRouter from "./src/routes/schemes.routes.js"

const app = express();

dotenv.config({
    path: ['.env.local', '.env']
})


// basic configuration
app.use(express.json());
app.use(express.urlencoded({extended:true, limit:"16kb"})); // this is for when the data is to be taken from the url
app.use(express.static("public"))
app.use(cookieParser());


// cors configuration

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true 
}))



app.use("/api/v1/auth",authRouter)
app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/userInfo",userInfoRouter)
app.use("/api/v1/schemes",schemesRouter)

app.use((err, req, res, next) => {
    console.error("Error caught:", err.message);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    });
});

connectDB()
.then(app.listen(process.env.PORT,()=>{
    console.log("server is running on port 8000!!")
})
).catch((err)=>{
    console.log("error occured",err)
})