import { Router } from "express";
import { apiKeyAuth, AuthedRequest } from "../middleware/auth";
import { basicRateLimit } from "../middleware/rateLimit";
import { asyncHandler } from "../middleware/asyncHandler";
import { imageGenerate, speech, textCompletion } from "../controllers/ai.controller";

const router = Router();

router.post("/text", apiKeyAuth, basicRateLimit, asyncHandler(textCompletion));
router.post("/image", apiKeyAuth, basicRateLimit, asyncHandler(imageGenerate));
router.post("/speech", apiKeyAuth, basicRateLimit, asyncHandler(speech));

export default router;
