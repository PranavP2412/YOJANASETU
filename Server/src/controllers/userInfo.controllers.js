import { UserInfo } from "../models/userInfo.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validationResult } from "express-validator";

const userInfoRegistering = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    const userId = req.user?._id; 
    if (!userId) {
        throw new ApiError(401, "Unauthorized request. User not found.");
    }
    const { category, gender, state, sector, stage, turnover, needs } = req.body;

    const existingProfile = await UserInfo.findOne({ userId });
    if (existingProfile) {
        existingProfile.category = category;
        existingProfile.gender = gender;
        existingProfile.stage = stage;
        existingProfile.sector = sector;
        existingProfile.turnover = turnover;
        existingProfile.needs = needs;
        existingProfile.state = state;

        await existingProfile.save();

        return res.status(201).json(
        new ApiResponse(201, existingProfile , "User profile details saved successfully")
    );


    }else{
        const userInfo = await UserInfo.create({
        userId,
        category,
        gender,
        state,
        sector,
        stage,
        turnover: turnover !== undefined ? turnover : 0,
        needs
    });

    if (!userInfo) {
        throw new ApiError(500, "Something went wrong while saving user profile.");
    }

    return res.status(201).json(
        new ApiResponse(201, userInfo, "User profile details saved successfully")
    );
    }

    
});


const getUserInfo = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const userProfile = await UserInfo.findOne({ userId }).select("-userId -__v");

    if (!userProfile) {
        throw new ApiError(404, "User profile not found. Please create one.");
    }
    
    return res.status(200).json(
        new ApiResponse(200, { userInfo: userProfile }, "User info successfully fetched!")
    );
});

export { userInfoRegistering, getUserInfo };