import { Router } from "express";
import { getSchemes,schemeDetail,bookmarkScheme } from "../controllers/schemes.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",getSchemes);
router.get("/:id",schemeDetail);
router.post("/bookmark",verifyJWT,bookmarkScheme)

export default router;