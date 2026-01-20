import express from "express";
import {login, logout, refreshAccessToken, resendEmailVerification, resetPassword, resetPasswordEmail, resgisterUser, verifyEmail} from "../controllers/auth.controllers.js"
import { userRegisterValidator, userLoginValidator, userResetPasswordValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",userRegisterValidator(),validate,resgisterUser)
// sabse pehle userRegisteredValidator run hota hai uske baad validate mai saare errors jaate hai and then uske baad sab kaam hota hai

router.post("/login",userLoginValidator(),validate,login);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/reset-password-email",resetPasswordEmail);
router.post("/reset-password/:resetToken",userResetPasswordValidator(),validate,resetPassword);
router.post("/refresh-token",refreshAccessToken)
router.post("/resend-emailVerification",verifyJWT,resendEmailVerification)

//secure routes
router.post("/logout",verifyJWT,logout);

export default router;