import express from "express";
import { getBookmarkedSchemes, getUserInfo, userInfoRegistering } from "../controllers/userInfo.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userInfoValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/userInfoRegister",verifyJWT,userInfoValidator(),validate,userInfoRegistering);
router.get("/userInfoGet",verifyJWT,getUserInfo);
router.get("/bookmarks",verifyJWT,getBookmarkedSchemes);


export default router;