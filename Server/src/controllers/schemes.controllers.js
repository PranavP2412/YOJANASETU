import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const getSchemes = asyncHandler(async(req,res)=>{
    
})