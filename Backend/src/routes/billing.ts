import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { clerkRequireAuth, syncClerkUser } from "../middleware/clerk";
import { createCheckoutSession, createPortalSession } from "../controllers/billing.controller";

const router = Router();

// these are the billing routes
router.post("/checkout", clerkRequireAuth, syncClerkUser, asyncHandler(createCheckoutSession));
router.post("/portal", clerkRequireAuth, syncClerkUser, asyncHandler(createPortalSession));

export default router;
