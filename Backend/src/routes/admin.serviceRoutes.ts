import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminOnly } from "../middleware/admin";
import { apiKeyAuth } from "../middleware/auth";
import { createServiceRoute, deleteServiceRoute, listServiceRoutes, updateServiceRoute } from "../controllers/serviceroute.controller";

const router = Router();

router.use(apiKeyAuth, adminOnly);

router.get("/", asyncHandler(listServiceRoutes));
router.post("/", asyncHandler(createServiceRoute));
router.put("/:id", asyncHandler(updateServiceRoute));
router.delete("/:id", asyncHandler(deleteServiceRoute));

export default router;
