import { Router } from "express";
import { apiKeyAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { myRecentLogs, myUsageSummary } from "../controllers/usage.controller";

const router = Router();

router.get("/summary", apiKeyAuth, asyncHandler(myUsageSummary));
router.get("/logs", apiKeyAuth, asyncHandler(myRecentLogs));

export default router;
