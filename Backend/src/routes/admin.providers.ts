import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminOnly } from "../middleware/admin";
import { apiKeyAuth } from "../middleware/auth";
import {
  listProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../controllers/provider.controller";

const router = Router();

router.use(apiKeyAuth);
router.get("/", asyncHandler(listProviders));
router.post("/", adminOnly, asyncHandler(createProvider));
router.put("/:id", adminOnly, asyncHandler(updateProvider));
router.delete("/:id", adminOnly, asyncHandler(deleteProvider));

export default router;
