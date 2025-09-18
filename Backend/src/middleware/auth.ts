import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ApiKey, IApiKey } from "../models/apikey.model";
import { User, IUser } from "../models/user.model";

export interface AuthedRequest extends Request {
  user?: IUser;
  apiKeyDoc?: IApiKey;
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function apiKeyAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const rawKey = (req.header("x-api-key") || "").trim();
    if (!rawKey) {
      return res.status(401).json({ error: "Missing x-api-key" });
    }
    const keyHash = sha256(rawKey);
    const apiKey = await ApiKey.findOne({ keyHash, status: "active" });
    if (!apiKey) {
      return res.status(401).json({ error: "Invalid or inactive API key" });
    }
    if (apiKey.expiresAt && apiKey.expiresAt.getTime() < Date.now()) {
      return res.status(401).json({ error: "API key expired" });
    }
    const user = await User.findById(apiKey.userId);
    if (!user || !user.isActive) {
      return res.status(403).json({ error: "User inactive or not found" });
    }
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    req.user = user;
    req.apiKeyDoc = apiKey;
    next();
  } catch (err) {
    next(err);
  }
}
