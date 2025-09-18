import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";
import { ApiKey } from "../models/apikey.model";
import { generateApiKey, sha256 } from "../utils/crypto";

export const listMyApiKeys = async (req: AuthedRequest, res: Response) => {
  const keys = await ApiKey.find({ userId: req.user!._id }).sort({ createdAt: -1 }).select("-keyHash");
  res.json(keys);
};

export const createMyApiKey = async (req: AuthedRequest, res: Response) => {
  const { label, scopes, expiresAt } = req.body || {};
  const raw = generateApiKey();
  const keyHash = sha256(raw);
  const created = await ApiKey.create({ userId: req.user!._id, keyHash, label, scopes: scopes || ["text"], expiresAt });
  // Return raw key only once
  res.status(201).json({ _id: created._id, apiKey: raw, label: created.label, scopes: created.scopes, status: created.status, createdAt: created.createdAt, expiresAt: created.expiresAt });
};

export const revokeMyApiKey = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const updated = await ApiKey.findOneAndUpdate({ _id: id, userId: req.user!._id }, { status: "revoked" }, { new: true });
  if (!updated) return res.status(404).json({ error: "API key not found" });
  res.json({ ok: true });
};
