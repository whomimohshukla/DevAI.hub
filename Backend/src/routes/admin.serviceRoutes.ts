import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { adminOnly } from "../middleware/admin";
import { apiKeyAuth } from "../middleware/auth";
import {
  listServiceRoutes,
  createServiceRoute,
  updateServiceRoute,
  deleteServiceRoute,
} from "../controllers/serviceroute.controller";

const router = Router();

router.use(apiKeyAuth);
router.get("/", asyncHandler(listServiceRoutes));
router.post("/", adminOnly, asyncHandler(createServiceRoute));
router.put("/:id", adminOnly, asyncHandler(updateServiceRoute));
router.delete("/:id", adminOnly, asyncHandler(deleteServiceRoute));

export default router;
