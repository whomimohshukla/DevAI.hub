import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { register, login, googleAuth } from "../controllers/auth.controller";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/google", asyncHandler(googleAuth));

export default router;
