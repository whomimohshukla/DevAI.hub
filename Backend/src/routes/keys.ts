import { Router } from "express";
import { apiKeyAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { createMyApiKey, listMyApiKeys, revokeMyApiKey } from "../controllers/apikey.controller";

const router = Router();

router.get("/", apiKeyAuth, asyncHandler(listMyApiKeys));
router.post("/", apiKeyAuth, asyncHandler(createMyApiKey));
router.post("/:id/revoke", apiKeyAuth, asyncHandler(revokeMyApiKey));

export default router;
