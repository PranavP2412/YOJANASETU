import { Router } from "express";
import { getSchemes,schemeDetail,bookmarkScheme } from "../controllers/schemes.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSchemeRecommendations } from "../controllers/userInfo.controllers.js";

const router = Router();

//these routes should be up becaouse /:id maan leta hai bookmark and recommend ko agar niche likha toh
router.post("/bookmark",verifyJWT,bookmarkScheme)
router.get("/recommend",verifyJWT,getSchemeRecommendations);

router.get("/",getSchemes);
router.get("/:id",schemeDetail);


export default router;