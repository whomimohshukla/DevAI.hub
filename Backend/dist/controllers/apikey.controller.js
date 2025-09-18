"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeMyApiKey = exports.createMyApiKey = exports.listMyApiKeys = void 0;
const apikey_model_1 = require("../models/apikey.model");
const crypto_1 = require("../utils/crypto");
const listMyApiKeys = async (req, res) => {
    const keys = await apikey_model_1.ApiKey.find({ userId: req.user._id }).sort({ createdAt: -1 }).select("-keyHash");
    res.json(keys);
};
exports.listMyApiKeys = listMyApiKeys;
const createMyApiKey = async (req, res) => {
    const { label, scopes, expiresAt } = req.body || {};
    const raw = (0, crypto_1.generateApiKey)();
    const keyHash = (0, crypto_1.sha256)(raw);
    const created = await apikey_model_1.ApiKey.create({ userId: req.user._id, keyHash, label, scopes: scopes || ["text"], expiresAt });
    // Return raw key only once
    res.status(201).json({ _id: created._id, apiKey: raw, label: created.label, scopes: created.scopes, status: created.status, createdAt: created.createdAt, expiresAt: created.expiresAt });
};
exports.createMyApiKey = createMyApiKey;
const revokeMyApiKey = async (req, res) => {
    const { id } = req.params;
    const updated = await apikey_model_1.ApiKey.findOneAndUpdate({ _id: id, userId: req.user._id }, { status: "revoked" }, { new: true });
    if (!updated)
        return res.status(404).json({ error: "API key not found" });
    res.json({ ok: true });
};
exports.revokeMyApiKey = revokeMyApiKey;
