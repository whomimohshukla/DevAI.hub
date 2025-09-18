"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const getMe = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthenticated" });
    const { _id, name, email, role, subscriptionPlan, isActive, createdAt, updatedAt } = req.user;
    res.json({ _id, name, email, role, subscriptionPlan, isActive, createdAt, updatedAt });
};
exports.getMe = getMe;
