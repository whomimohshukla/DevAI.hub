import { NextFunction, Response } from "express";
import { requireAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";
import { AuthedRequest } from "./auth";
import { User } from "../models/user.model";

export const clerkRequireAuth = requireAuth();

export async function syncClerkUser(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const auth = (req as any).auth as { userId?: string } | undefined;
    if (!auth?.userId) return next(new Error("Clerk auth missing userId"));

    // Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(auth.userId);
    const email = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || undefined;
    const name = clerkUser?.fullName || clerkUser?.firstName || email || `user_${auth.userId}`;
    const imageUrl = clerkUser?.imageUrl || undefined;

    // Find or create local user
    let user = await User.findOne({ clerkUserId: auth.userId });
    if (!user) {
      // If email exists locally, link it; else create new
      user = await User.findOne({ email: email || `unknown+${auth.userId}@example.com` });
      if (user) {
        user.clerkUserId = auth.userId;
        if (name && !user.name) user.name = name as string;
        if (imageUrl && !user.profileImage) user.profileImage = imageUrl as string;
        await user.save();
      } else {
        user = await User.create({
          name: name as string,
          email: email || `unknown+${auth.userId}@example.com`,
          password: "",
          clerkUserId: auth.userId,
          role: "user",
          isActive: true,
          profileImage: imageUrl,
        });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function clerkAdminOnly(req: AuthedRequest, res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (role === "admin") return next();
  // Optionally allow admin via env ADMIN_EMAILS=comma,separated
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const email = (req.user as any)?.email?.toLowerCase?.();
  if (email && adminEmails.includes(email)) return next();
  return res.status(403).json({ error: "Admin access required" });
}
