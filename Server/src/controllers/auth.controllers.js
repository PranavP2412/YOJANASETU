import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent } from "../utils/mail.js"; // Ensure sendWelcomeEmail is exported from here
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';

dotenv.config({
    path: ['.env.local', '.env']
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token!", []);
    }
};

const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body; 

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {

            user = await User.create({
                FullName: name,
                email,
                avatar: picture,
                authProvider: 'google',
                isEmailVerified: true,
                password: crypto.randomBytes(20).toString('hex')
            });
        }

        const { accessToken, refreshToken } = await AccessAndRefreshToken(user._id);


        const options = {
            httpOnly: true,
            secure: true
        };

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
        );

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
            .json(
                new ApiResponse(200, {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }, "Google Login Successful")
            );

    } catch (error) {
        console.error("Google Auth Error:", error);
        throw new ApiError(401, "Google authentication failed");
    }
});

const resgisterUser = asyncHandler(async (req, res) => {
    const { email, password, FullName } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists!", []);
    }

    const user = await User.create({
        email,
        password,
        isEmailVerified: false,
        FullName
    });
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.emailVerficationToken = hashedToken;
    user.emailVerficationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });
    await sendEmail({
        email: user?.email,
        subject: "Please verify your email!!",
        mailgenContent: emailVerificationMailgenContent(user.FullName, `https://yojanasetu-frontend-1.onrender.com/verify-email/${unHashedToken}`)
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res.status(201).json(new ApiResponse(200, { user: createdUser }, "User registered successfully and verification email has been sent on your email"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
    };
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
    );

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "user logged in successfully")
        );
});

const logout = asyncHandler(async (req, res) => {
    const userData = req.user;
    await User.findByIdAndUpdate(userData._id, {
        $set: {
            refreshToken: "",
        }
    });
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully."));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        emailVerficationToken: hashedToken,
        emailVerficationExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired email verification token.");
    }

    user.isEmailVerified = true;
    user.emailVerficationToken = undefined;
    user.emailVerficationExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {
        isEmailVerified: true
    }, "Email verified successfully!"));
});

const resetPasswordEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(404, "This email id is not registered!");
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: email,
        subject: "Please reset your password",
        mailgenContent: forgotPasswordMailgenContent(user.FullName, `https://yojanasetu-frontend-1.onrender.com/reset-password/${unHashedToken}`)
    });

    return res.status(201).json(new ApiResponse(200, {}, "User password reset link has been sent to your email"));
});

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

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully!"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
        throw new ApiError(401, "Unauthorised access!");
    }
    try {
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Unauthorised access");
        }
        if (incomingToken !== user.refreshToken) {
            throw new ApiError(400, "Refresh Token is expired!");
        }

        const { refreshToken: newRefreshToken, accessToken } = await AccessAndRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken, newRefreshToken
                }, "AccessToken is refreshed")
            );

    } catch (error) {
        throw new ApiError(400, "Refresh Token is expired!");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "Invalid access!");
    }
    return res.status(200).json(new ApiResponse(200, user, "Data sent successfully!"));
});

export {
    resgisterUser,
    login,
    googleLogin,
    logout,
    verifyEmail,
    resetPasswordEmail,
    resetPassword,
    refreshAccessToken,
    currentUser
};