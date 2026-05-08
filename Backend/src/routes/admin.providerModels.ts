import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminOnly } from "../middleware/admin";
import { apiKeyAuth } from "../middleware/auth";
import {
  listProviderModels,
  createProviderModel,
  updateProviderModel,
  deleteProviderModel,
} from "../controllers/providermodel.controller";

const router = Router();

router.use(apiKeyAuth);
router.get("/", asyncHandler(listProviderModels));
router.post("/", adminOnly, asyncHandler(createProviderModel));
router.put("/:id", adminOnly, asyncHandler(updateProviderModel));
router.delete("/:id", adminOnly, asyncHandler(deleteProviderModel));

export default router;
