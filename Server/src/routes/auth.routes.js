import express from "express";
import {resgisterUser} from "../controllers/auth.controllers.js"

const router = express.Router();

router.post("/register",resgisterUser)

export default router;