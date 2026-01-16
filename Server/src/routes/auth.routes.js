import express from "express";
import {resgisterUser} from "../controllers/auth.controllers.js"
import { userRegisterValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = express.Router();

router.post("/register",userRegisterValidator(),validate,resgisterUser)
// sabse pehle userRegisteredValidator run hota hai uske baad validate mai saare errors jaate hai and then uske baad sab kaam hota hai

export default router;