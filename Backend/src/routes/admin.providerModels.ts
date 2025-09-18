import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { clerkRequireAuth, clerkAdminOnly, syncClerkUser } from "../middleware/clerk";
import { createProviderModel, deleteProviderModel, listProviderModels, updateProviderModel } from "../controllers/providermodel.controller";

const router = Router();

router.use(clerkRequireAuth, syncClerkUser, clerkAdminOnly);

router.get("/", asyncHandler(listProviderModels));
router.post("/", asyncHandler(createProviderModel));
router.put("/:id", asyncHandler(updateProviderModel));
router.delete("/:id", asyncHandler(deleteProviderModel));

export default router;
