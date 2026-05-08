import { Router } from "express";
import { apiKeyAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { myUsageSummary, myRecentLogs } from "../controllers/usage.controller";

const router = Router();

router.get("/summary", apiKeyAuth, asyncHandler(myUsageSummary));
router.get("/logs", apiKeyAuth, asyncHandler(myRecentLogs));

export default router;
