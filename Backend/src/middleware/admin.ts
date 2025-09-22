import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth";


// middleware to allow only admin users
export function adminOnly(req: AuthedRequest, res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (role !== "admin") return res.status(403).json({ error: "Admin access required" });
  next();
}
