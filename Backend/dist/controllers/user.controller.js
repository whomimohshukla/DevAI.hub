"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.changePassword = exports.updateMe = exports.getMe = void 0;
const apikey_model_1 = require("../models/apikey.model");
const crypto_1 = require("../utils/crypto");
const getMe = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthenticated" });
    const { _id, name, email, role, subscriptionPlan, credits, authProvider, profileImage, isActive, createdAt, updatedAt, } = req.user;
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
exports.getMe = getMe;
const updateMe = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthenticated" });
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
exports.updateMe = updateMe;
const changePassword = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthenticated" });
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters" });
    }
    const isGoogleOnly = req.user.authProvider === "google";
    if (!isGoogleOnly) {
        if (!currentPassword || typeof currentPassword !== "string") {
            return res.status(400).json({ error: "Current password is required" });
        }
        const valid = (0, crypto_1.verifyPassword)(currentPassword, req.user.hashedPassword);
        if (!valid)
            return res.status(401).json({ error: "Current password is incorrect" });
    }
    req.user.hashedPassword = (0, crypto_1.hashPassword)(newPassword);
    req.user.authProvider = "local";
    await req.user.save();
    return res.json({ ok: true });
};
exports.changePassword = changePassword;
const deleteMe = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthenticated" });
    req.user.isActive = false;
    await req.user.save();
    await apikey_model_1.ApiKey.updateMany({ userId: req.user._id }, { status: "revoked" });
    return res.json({ ok: true });
};
exports.deleteMe = deleteMe;
