import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { clerkRequireAuth, syncClerkUser } from "../middleware/clerk";
import { getMe } from "../controllers/user.controller";

const router = Router();


// these are the routes for managing users
router.get("/me", clerkRequireAuth, syncClerkUser, asyncHandler(getMe));

export default router;
