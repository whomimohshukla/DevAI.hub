import { Router } from "express";
import { apiKeyAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { getMe } from "../controllers/user.controller";

const router = Router();

router.get("/me", apiKeyAuth, asyncHandler(getMe));

export default router;
