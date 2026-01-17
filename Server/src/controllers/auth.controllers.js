import {User} from "../models/user.models.js";
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import {asyncHandler} from "../utils/async-handler.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import cookieParser from "cookie-parser";



const AccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token!",[])
    }

}

const resgisterUser = asyncHandler(async (req,res)=>{
    const {username, email, password} = req.body;

    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User with email or username already exists!",[])
    }

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified: false
    
    })
    const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken();
    user.emailVerficationToken = hashedToken;
    user.emailVerficationExpiry = tokenExpiry;

    await user.save({validateBeforeSave:false});
    await sendEmail({
        email:user?.email,
        subject:"Please verify your email!!",
        mailgenContent:emailVerificationMailgenContent(user.username,`${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}` )
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }

    return res.status(201).json(new ApiResponse(200,{user:createdUser},"User registered successfully and verification email has been sent on your email"));

})

const login = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(500,"This email ID is not registered!",[]);
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if(!checkPassword){
        throw new ApiError(400,"Please give correct password",[]);
    }
    const {accessToken, refreshToken} = await AccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
    )

    return res.status(200)
    .cookie("AccessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,
            refreshToken,
            accessToken
        },
    "user logged in successfully")
    )

})

const logout = asyncHandler(async(req,res)=>{
    const userData = req.user;
    const user = await User.findByIdAndUpdate(userData._id,{
        $set:{
            refreshToken:"",
        }
    })
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200, {},"User logged out successfully."))
})

export {resgisterUser, login, logout};