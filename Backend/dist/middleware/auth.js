"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = apiKeyAuth;
const crypto_1 = __importDefault(require("crypto"));
const apikey_model_1 = require("../models/apikey.model");
const user_model_1 = require("../models/user.model");
function sha256(input) {
    return crypto_1.default.createHash("sha256").update(input).digest("hex");
}
async function apiKeyAuth(req, res, next) {
    try {
        const rawKey = (req.header("x-api-key") || "").trim();
        if (!rawKey) {
            return res.status(401).json({ error: "Missing x-api-key" });
        }
        const keyHash = sha256(rawKey);
        const apiKey = await apikey_model_1.ApiKey.findOne({ keyHash, status: "active" });
        if (!apiKey) {
            return res.status(401).json({ error: "Invalid or inactive API key" });
        }
        if (apiKey.expiresAt && apiKey.expiresAt.getTime() < Date.now()) {
            return res.status(401).json({ error: "API key expired" });
        }
        const user = await user_model_1.User.findById(apiKey.userId);
        if (!user || !user.isActive) {
            return res.status(403).json({ error: "User inactive or not found" });
        }
        apiKey.lastUsedAt = new Date();
        await apiKey.save();
        req.user = user;
        req.apiKeyDoc = apiKey;
        next();
    }
    catch (err) {
        next(err);
    }
}
