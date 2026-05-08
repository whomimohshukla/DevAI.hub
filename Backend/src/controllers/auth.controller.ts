import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import { ApiKey } from "../models/apikey.model";
import {
  hashPassword,
  verifyPassword,
  generateApiKey,
  getApiKeyId,
  sha256,
} from "../utils/crypto";

async function issueSessionKey(userId: unknown, label: string) {
  const raw = generateApiKey();
  await ApiKey.create({
    userId,
    keyId: getApiKeyId(raw),
    keyHash: sha256(raw),
    label,
    scopes: ["text", "image", "speech"],
  });
  return raw;
}

type GoogleProfile = {
  sub: string;
  email: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
};

async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const err = new Error("Google sign-in is not configured");
    (err as Error & { status?: number }).status = 503;
    throw err;
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  const data = (await response.json().catch(() => null)) as
    | {
        aud?: string;
        sub?: string;
        email?: string;
        email_verified?: string | boolean;
        name?: string;
        picture?: string;
      }
    | null;

  if (!response.ok || !data?.sub || !data.email || data.aud !== clientId) {
    const err = new Error("Google sign-in could not be verified");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }

  return data as GoogleProfile;
}

function authResponse(user: IUser, apiKey: string) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    apiKey,
  };
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });
  }
  if (typeof password === "string" && password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }
  const existing = await User.findOne({
    email: (email as string).toLowerCase().trim(),
  });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const hashed = hashPassword(password as string);
  const user = await User.create({
    name: (name as string).trim(),
    email: (email as string).toLowerCase().trim(),
    hashedPassword: hashed,
  });
  const raw = await issueSessionKey(user._id, "Default");
  return res.status(201).json(authResponse(user, raw));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const user = await User.findOne({
    email: (email as string).toLowerCase().trim(),
  });
  if (!user || !user.isActive) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const valid = verifyPassword(password as string, user.hashedPassword);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const raw = await issueSessionKey(
    user._id,
    `Session ${new Date().toISOString().slice(0, 10)}`
  );
  user.lastLogin = new Date();
  await user.save();
  return res.json(authResponse(user, raw));
};

export const googleAuth = async (req: Request, res: Response) => {
  const { credential } = req.body || {};
  if (!credential || typeof credential !== "string") {
    return res.status(400).json({ error: "Google credential is required" });
  }

  const profile = await verifyGoogleIdToken(credential);
  const email = profile.email.toLowerCase().trim();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: profile.name || email.split("@")[0],
      email,
      hashedPassword: hashPassword(generateApiKey()),
      authProvider: "google",
      googleId: profile.sub,
      profileImage: profile.picture,
      emailVerified: profile.email_verified ? new Date() : null,
    });
  } else {
    user.googleId = user.googleId || profile.sub;
    user.profileImage = user.profileImage || profile.picture;
    if (profile.email_verified && !user.emailVerified) user.emailVerified = new Date();
  }

  if (!user.isActive) {
    return res.status(403).json({ error: "This account is inactive" });
  }

  const raw = await issueSessionKey(
    user._id,
    `Google session ${new Date().toISOString().slice(0, 10)}`
  );
  user.lastLogin = new Date();
  await user.save();

  return res.json(authResponse(user, raw));
};
