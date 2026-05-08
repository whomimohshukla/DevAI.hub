import { Router } from "express";
import { apiKeyAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  changePassword,
  deleteMe,
  getMe,
  updateMe,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", apiKeyAuth, asyncHandler(getMe));
router.put("/me", apiKeyAuth, asyncHandler(updateMe));
router.post("/change-password", apiKeyAuth, asyncHandler(changePassword));
router.delete("/me", apiKeyAuth, asyncHandler(deleteMe));

export default router;
