import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const healthCheck = asyncHandler(async (req,res,next)=>{
    res.status(200).json(new ApiResponse(200,{message:"Server is running!!"}));
})

// instead of writing try catch block every time i can give an async function to the async handler which can give the error to the next that is global error handler with 4 arguments

export {healthCheck}