import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const {
    _id,
    name,
    email,
    role,
    subscriptionPlan,
    credits,
    isActive,
    createdAt,
    updatedAt,
  } = req.user;
  return res.json({
    _id,
    name,
    email,
    role,
    subscriptionPlan,
    credits,
    isActive,
    createdAt,
    updatedAt,
  });
};
