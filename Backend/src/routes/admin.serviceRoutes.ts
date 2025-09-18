import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { clerkRequireAuth, clerkAdminOnly, syncClerkUser } from "../middleware/clerk";
import { createServiceRoute, deleteServiceRoute, listServiceRoutes, updateServiceRoute } from "../controllers/serviceroute.controller";

const router = Router();

router.use(clerkRequireAuth, syncClerkUser, clerkAdminOnly);

router.get("/", asyncHandler(listServiceRoutes));
router.post("/", asyncHandler(createServiceRoute));
router.put("/:id", asyncHandler(updateServiceRoute));
router.delete("/:id", asyncHandler(deleteServiceRoute));

export default router;
