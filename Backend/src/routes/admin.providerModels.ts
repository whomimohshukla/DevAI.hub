import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminOnly } from "../middleware/admin";
import { apiKeyAuth } from "../middleware/auth";
import { createProviderModel, deleteProviderModel, listProviderModels, updateProviderModel } from "../controllers/providermodel.controller";

const router = Router();

router.use(apiKeyAuth, adminOnly);

router.get("/", asyncHandler(listProviderModels));
router.post("/", asyncHandler(createProviderModel));
router.put("/:id", asyncHandler(updateProviderModel));
router.delete("/:id", asyncHandler(deleteProviderModel));

export default router;
