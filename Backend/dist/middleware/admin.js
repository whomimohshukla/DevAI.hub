"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = adminOnly;
function adminOnly(req, res, next) {
    const role = req.user?.role;
    if (role !== "admin")
        return res.status(403).json({ error: "Admin access required" });
    next();
}
