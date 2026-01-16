import express, { urlencoded } from "express";
import  dotenv from "dotenv";
import authRouter from "./src/routes/auth.routes.js";
import cors from "cors";
import connectDB from "./src/db/index.js";
import  healthCheckRouter  from "./src/routes/healthcheck.routes.js";

const app = express();

dotenv.config({
    path: ['.env.local', '.env']
})


// basic configuration
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"})); // this is for when the data is to be taken from the url
app.use(express.static("public"))

//global error handling
app.use((err, req, res, next) => {
    console.error("Error caught:", err.message);
    
    // Send the response to the client
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    });
});

// cors configuration

app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods:["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders:["Authorization","Content-Type"]
}))



app.use("/api/v1/auth",authRouter)
app.use("/api/v1/healthcheck",healthCheckRouter)

connectDB()
.then(app.listen(process.env.PORT,()=>{
    console.log("server is running on port 8000!!")
})
).catch((err)=>{
    console.log("error occured",err)
})