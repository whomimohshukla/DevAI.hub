import { Request, Response } from "express";
import { ApiKey } from "../models/apikey.model";
import { generateApiKey, sha256 } from "../utils/crypto";

export const listMyApiKeys = async (req: Request, res: Response) => {
  const keys = await ApiKey.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("-keyHash");
  return res.json(keys);
};

export const createMyApiKey = async (req: Request, res: Response) => {
  const { label, scopes, expiresAt } = req.body || {};
  const raw = generateApiKey();
  const keyHash = sha256(raw);
  const created = await ApiKey.create({
    userId: req.user._id,
    keyHash,
    label,
    scopes: scopes || ["text"],
    expiresAt,
  });
  return res.status(201).json({
    _id: created._id,
    apiKey: raw,
    label: created.label,
    scopes: created.scopes,
    status: created.status,
    createdAt: created.createdAt,
    expiresAt: created.expiresAt,
  });
};

export const revokeMyApiKey = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await ApiKey.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { status: "revoked" },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "API key not found" });
  return res.json({ ok: true });
};
