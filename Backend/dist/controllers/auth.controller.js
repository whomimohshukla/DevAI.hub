"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const apikey_model_1 = require("../models/apikey.model");
const crypto_1 = require("../utils/crypto");
async function issueSessionKey(userId, label) {
    const raw = (0, crypto_1.generateApiKey)();
    await apikey_model_1.ApiKey.create({
        userId,
        keyId: (0, crypto_1.getApiKeyId)(raw),
        keyHash: (0, crypto_1.sha256)(raw),
        label,
        scopes: ["text", "image", "speech"],
    });
    return raw;
}
async function verifyGoogleIdToken(idToken) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        const err = new Error("Google sign-in is not configured");
        err.status = 503;
        throw err;
    }
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    const data = (await response.json().catch(() => null));
    if (!response.ok || !data?.sub || !data.email || data.aud !== clientId) {
        const err = new Error("Google sign-in could not be verified");
        err.status = 401;
        throw err;
    }
    return data;
}
function authResponse(user, apiKey) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        apiKey,
    };
}
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
    const raw = await issueSessionKey(user._id, "Default");
    return res.status(201).json(authResponse(user, raw));
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
    const raw = await issueSessionKey(user._id, `Session ${new Date().toISOString().slice(0, 10)}`);
    user.lastLogin = new Date();
    await user.save();
    return res.json(authResponse(user, raw));
};
exports.login = login;
const googleAuth = async (req, res) => {
    const { credential } = req.body || {};
    if (!credential || typeof credential !== "string") {
        return res.status(400).json({ error: "Google credential is required" });
    }
    const profile = await verifyGoogleIdToken(credential);
    const email = profile.email.toLowerCase().trim();
    let user = await user_model_1.User.findOne({ email });
    if (!user) {
        user = await user_model_1.User.create({
            name: profile.name || email.split("@")[0],
            email,
            hashedPassword: (0, crypto_1.hashPassword)((0, crypto_1.generateApiKey)()),
            authProvider: "google",
            googleId: profile.sub,
            profileImage: profile.picture,
            emailVerified: profile.email_verified ? new Date() : null,
        });
    }
    else {
        user.googleId = user.googleId || profile.sub;
        user.profileImage = user.profileImage || profile.picture;
        if (profile.email_verified && !user.emailVerified)
            user.emailVerified = new Date();
    }
    if (!user.isActive) {
        return res.status(403).json({ error: "This account is inactive" });
    }
    const raw = await issueSessionKey(user._id, `Google session ${new Date().toISOString().slice(0, 10)}`);
    user.lastLogin = new Date();
    await user.save();
    return res.json(authResponse(user, raw));
};
exports.googleAuth = googleAuth;
