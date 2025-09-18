import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createMyApiKey, listMyApiKeys, revokeMyApiKey } from "../controllers/apikey.controller";
import { clerkRequireAuth, syncClerkUser } from "../middleware/clerk";

const router = Router();

router.get("/", clerkRequireAuth, syncClerkUser, asyncHandler(listMyApiKeys));
router.post("/", clerkRequireAuth, syncClerkUser, asyncHandler(createMyApiKey));
router.post("/:id/revoke", clerkRequireAuth, syncClerkUser, asyncHandler(revokeMyApiKey));

export default router;
