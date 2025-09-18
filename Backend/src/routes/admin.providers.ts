import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { clerkRequireAuth, clerkAdminOnly, syncClerkUser } from "../middleware/clerk";
import { createProvider, deleteProvider, listProviders, updateProvider } from "../controllers/provider.controller";

const router = Router();

router.use(clerkRequireAuth, syncClerkUser, clerkAdminOnly);

router.get("/", asyncHandler(listProviders));
router.post("/", asyncHandler(createProvider));
router.put("/:id", asyncHandler(updateProvider));
router.delete("/:id", asyncHandler(deleteProvider));

export default router;
