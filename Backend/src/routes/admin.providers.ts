import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminOnly } from "../middleware/admin";
import { apiKeyAuth } from "../middleware/auth";
import { createProvider, deleteProvider, listProviders, updateProvider } from "../controllers/provider.controller";

const router = Router();

router.use(apiKeyAuth, adminOnly);

router.get("/", asyncHandler(listProviders));
router.post("/", asyncHandler(createProvider));
router.put("/:id", asyncHandler(updateProvider));
router.delete("/:id", asyncHandler(deleteProvider));

export default router;
