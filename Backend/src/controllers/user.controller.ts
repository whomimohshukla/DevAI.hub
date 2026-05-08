import { Request, Response } from "express";
import { ApiKey } from "../models/apikey.model";
import { hashPassword, verifyPassword } from "../utils/crypto";

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const {
    _id,
    name,
    email,
    role,
    subscriptionPlan,
    credits,
    authProvider,
    profileImage,
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
    authProvider,
    profileImage,
    isActive,
    createdAt,
    updatedAt,
  });
};

export const updateMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const { name } = req.body || {};
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters" });
  }

  req.user.name = name.trim();
  await req.user.save();

  return res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    subscriptionPlan: req.user.subscriptionPlan,
    credits: req.user.credits,
    authProvider: req.user.authProvider,
    profileImage: req.user.profileImage,
    isActive: req.user.isActive,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const { currentPassword, newPassword } = req.body || {};

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  const isGoogleOnly = req.user.authProvider === "google";
  if (!isGoogleOnly) {
    if (!currentPassword || typeof currentPassword !== "string") {
      return res.status(400).json({ error: "Current password is required" });
    }
    const valid = verifyPassword(currentPassword, req.user.hashedPassword);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
  }

  req.user.hashedPassword = hashPassword(newPassword);
  req.user.authProvider = "local";
  await req.user.save();

  return res.json({ ok: true });
};

export const deleteMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });

  req.user.isActive = false;
  await req.user.save();
  await ApiKey.updateMany({ userId: req.user._id }, { status: "revoked" });

  return res.json({ ok: true });
};
