"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const apikey_model_1 = require("../models/apikey.model");
const crypto_1 = require("../utils/crypto");
const register = async (req, res) => {
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
    const existing = await user_model_1.User.findOne({
        email: email.toLowerCase().trim(),
    });
    if (existing) {
        return res.status(409).json({ error: "Email already registered" });
    }
    const hashed = (0, crypto_1.hashPassword)(password);
    const user = await user_model_1.User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        hashedPassword: hashed,
    });
    const raw = (0, crypto_1.generateApiKey)();
    const keyHash = (0, crypto_1.sha256)(raw);
    await apikey_model_1.ApiKey.create({
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
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }
    const user = await user_model_1.User.findOne({
        email: email.toLowerCase().trim(),
    });
    if (!user || !user.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = (0, crypto_1.verifyPassword)(password, user.hashedPassword);
    if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const raw = (0, crypto_1.generateApiKey)();
    const keyHash = (0, crypto_1.sha256)(raw);
    await apikey_model_1.ApiKey.create({
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
exports.login = login;
