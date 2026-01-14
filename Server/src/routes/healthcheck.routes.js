import { healthCheck } from "../controllers/healthcheck.controllers.js";
import express from "express"

const router = express.Router();

router.get("/",healthCheck)

export default router;