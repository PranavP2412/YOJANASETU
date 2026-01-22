import { UserInfo } from "../models/userInfo.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validationResult } from "express-validator";
import { User } from "../models/user.models.js";

const userInfoRegistering = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    // 2. Get the Logged-in User's ID
    // specific middleware (like verifyJWT) must run before this to set req.user
    const userId = req.user?._id; 

    if (!userId) {
        throw new ApiError(401, "Unauthorized request. User not found.");
    }

    // 3. Extract Data from Request Body
    const { 
        category, 
        gender, 
        state, 
        sector, 
        stage, 
        turnover, 
        needs 
    } = req.body;

    // 4. Check if Profile Already Exists
    // Since we set userId as unique in schema, we should check before creating
    const existingProfile = await UserInfo.findOne({ userId });

    if (existingProfile) {
        throw new ApiError(409, "User profile already exists. Please update instead of creating new.");
    }

    // 5. Create the Document
    const userInfo = await UserInfo.create({
        userId,
        category,
        gender,
        state,
        sector,
        stage,
        turnover: turnover || 0, // Default to 0 if not provided
        needs
    });

    if (!userInfo) {
        throw new ApiError(500, "Something went wrong while saving user profile.");
    }

    // 6. Return Success Response
    return res.status(201).json(
        new ApiResponse(201, userInfo, "User profile details saved successfully")
    );
});

const getUserInfo =asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const user = await UserInfo.findOne({
        userId
    });
    if(!user){
        throw new ApiError(401,"Unauthorised access!!");
    }
    const createdUser = await UserInfo.findById(user._id).select(
        "-userId"
    )
    if(!createdUser){
        throw new ApiError(400, "Something went wrong! Please try again later.")
    }
    
    return res.status(201).json(new ApiResponse(200,{userInfo:createdUser},"User info is successfully fetched!"))


})

export { userInfoRegistering, getUserInfo };