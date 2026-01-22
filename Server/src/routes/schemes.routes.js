import { Router } from "express";
import { getSchemes } from "../controllers/schemes.controllers.js";

const router = Router();

router.get("/",getSchemes);

export default router;