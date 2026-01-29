import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import crypto from "crypto";



const AccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token!", [])
    }

}

const resgisterUser = asyncHandler(async (req, res) => {
    const { username, email, password,FullName } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists!", [])
    }

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified:false,
        FullName
    })
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.emailVerficationToken = hashedToken;
    user.emailVerficationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });
    await sendEmail({
        email: user?.email,
        subject: "Please verify your email!!",
        mailgenContent: emailVerificationMailgenContent(user.username, `http://localhost:5173/verify-email/${unHashedToken}`)
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res.status(201).json(new ApiResponse(200, { user: createdUser }, "User registered successfully and verification email has been sent on your email"));

})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(500, "This email ID is not registered!", []);
    }

    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
        throw new ApiError(400, "Please give correct password", []);
    }
    const { accessToken, refreshToken } = await AccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
    )

    return res.status(200)
        .cookie("AccessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                refreshToken,
                accessToken
            },
                "user logged in successfully")
        )

})

const logout = asyncHandler(async (req, res) => {
    const userData = req.user;
    const user = await User.findByIdAndUpdate(userData._id, {
        $set: {
            refreshToken: "",
        }
    })
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully."))
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    // 1. Create the hash
    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find the user (Variable MUST be named 'user')
    const user = await User.findOne({
        emailVerficationToken: hashedToken,
        emailVerficationExpiry: { $gt: Date.now() }
    });

    // 3. Check if user was found
    if (!user) {
        throw new ApiError(400, "Invalid or expired email verification token.");
    }

    // 4. Update the user
    user.isEmailVerified = true;
    user.emailVerficationToken = undefined;
    user.emailVerficationExpiry = undefined;

    
    await user.save({ validateBeforeSave: false });

    console.log("doneeeeeee")

    return res.status(200).json(new ApiResponse(200, {
        isEmailVerified: true
    }, "Email verified successfully!"));
});

const resetPasswordEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        throw new ApiError(500, "This email id is not registered!");
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });



    await sendEmail({
        email: email,
        subject: "Please reset your password",
        mailgenContent: forgotPasswordMailgenContent(user.username, `http://localhost:5173/reset-password/${unHashedToken}`)
    })

    return res.status(201).json(new ApiResponse(200,{}, "User password reset link has been sent to your email"));

})

const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired password reset token.");
    }

    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    console.log("done")

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully!"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404,"User does not exist!")
    }

    if(user.isEmailVerified){
        throw new ApiError(409, "User is already registered")
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.emailVerficationToken = hashedToken;
    user.emailVerficationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email!!",
        mailgenContent: emailVerificationMailgenContent(user.username, `http://localhost:5173/verify-email/${unHashedToken}`)
    });

    return res.status(200).json(new ApiResponse(200, {}, "Verification email re-sent successfully!"));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingToken){
        throw new ApiError(401,"Unauthorised access!")
    }
    try {
        const decodedToken = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401,"Unauthorised access")
        }
        if(incomingToken !== user.refreshToken){
            throw new ApiError(400, "Refresh Token is expired!")
        }

        const {refreshToken: newRefreshToken, accessToken} = await AccessAndRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(200,{
                accessToken, newRefreshToken
            },"AccessToken is refreshed")
        )
        

    } catch (error) {
        throw new ApiError(400, "Refresh Token is expired!")
    }
})

const currentUser = asyncHandler(async(req,res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(404,"Invalid access!");
    }
    return res.status(200).json(new ApiResponse(200,user,"Data sent successfully!"));

})




export {
    resgisterUser,
    login,
    logout,
    verifyEmail,
    resetPasswordEmail,
    resetPassword,
    resendEmailVerification,
    refreshAccessToken,
    currentUser
};