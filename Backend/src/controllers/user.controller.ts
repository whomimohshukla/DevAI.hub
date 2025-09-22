import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";


// get details of the authenticated user
export const getMe = async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const { _id, name, email, role, subscriptionPlan, isActive, createdAt, updatedAt } = req.user;
  res.json({ _id, name, email, role, subscriptionPlan, isActive, createdAt, updatedAt });
};
