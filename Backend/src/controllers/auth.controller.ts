import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiKey } from "../models/apikey.model";
import {
  hashPassword,
  verifyPassword,
  generateApiKey,
  sha256,
} from "../utils/crypto";

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
  const raw = generateApiKey();
  const keyHash = sha256(raw);
  await ApiKey.create({
    userId: user._id,
    keyHash,
    label: "Default",
    scopes: ["text", "image", "speech"],
  });
  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    apiKey: raw,
  });
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
  const raw = generateApiKey();
  const keyHash = sha256(raw);
  await ApiKey.create({
    userId: user._id,
    keyHash,
    label: `Session ${new Date().toISOString().slice(0, 10)}`,
    scopes: ["text", "image", "speech"],
  });
  user.lastLogin = new Date();
  await user.save();
  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    apiKey: raw,
  });
};
