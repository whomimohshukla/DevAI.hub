import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { myRecentLogs, myUsageSummary } from "../controllers/usage.controller";
import { clerkRequireAuth, syncClerkUser } from "../middleware/clerk";

const router = Router();

router.get("/summary", clerkRequireAuth, syncClerkUser, asyncHandler(myUsageSummary));
router.get("/logs", clerkRequireAuth, syncClerkUser, asyncHandler(myRecentLogs));

export default router;
