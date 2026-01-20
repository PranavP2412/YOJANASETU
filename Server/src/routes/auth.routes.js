import express from "express";
import {login, logout, resetPassword, resetPasswordEmail, resgisterUser} from "../controllers/auth.controllers.js"
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",userRegisterValidator(),validate,resgisterUser)
// sabse pehle userRegisteredValidator run hota hai uske baad validate mai saare errors jaate hai and then uske baad sab kaam hota hai

router.post("/login",userLoginValidator(),validate,login);
router.post("/logout",verifyJWT,logout);
router.post("/verify-email/:verificationToken", verifyEmail);
router.post("/reset-password-email",resetPasswordEmail);
router.post("/reset-password/:resetToken",resetPassword);




export default router;