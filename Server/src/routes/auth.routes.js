import express from "express";
import {currentUser, login, logout, refreshAccessToken, resetPassword, resetPasswordEmail, resgisterUser, verifyEmail, googleLogin} from "../controllers/auth.controllers.js"
import { userRegisterValidator, userLoginValidator, userResetPasswordValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/register",userRegisterValidator(),validate,resgisterUser)
// sabse pehle userRegisteredValidator run hota hai uske baad validate mai saare errors jaate hai and then uske baad sab kaam hota hai
router.post('/google', googleLogin);
router.post("/login",userLoginValidator(),validate,login);
router.post("/verify-email/:token", verifyEmail);
router.post("/reset-password-email",resetPasswordEmail);
router.post("/reset-password/:resetToken",userResetPasswordValidator(),validate,resetPassword);
router.post("/refresh-token",refreshAccessToken)



//secure routes
router.post("/logout",verifyJWT,logout);
router.get("/current-user",verifyJWT,currentUser);
export default router;