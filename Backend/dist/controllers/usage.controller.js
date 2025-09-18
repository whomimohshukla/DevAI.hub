"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myRecentLogs = exports.myUsageSummary = void 0;
const requestlog_model_1 = require("../models/requestlog.model");
const myUsageSummary = async (req, res) => {
    const userId = req.user._id;
    const { from, to } = req.query;
    const match = { userId };
    if (from || to) {
        match.createdAt = {};
        if (from)
            match.createdAt.$gte = new Date(from);
        if (to)
            match.createdAt.$lte = new Date(to);
    }
    const agg = await requestlog_model_1.RequestLog.aggregate([
        { $match: match },
        {
            $group: {
                _id: { service: "$service", routeName: "$routeName" },
                requests: { $sum: 1 },
                tokensUsed: { $sum: { $ifNull: ["$tokensUsed", 0] } },
                avgLatencyMs: { $avg: { $ifNull: ["$latencyMs", 0] } },
                errors: { $sum: { $cond: [{ $eq: ["$status", "error"] }, 1, 0] } },
            },
        },
        {
            $project: {
                _id: 0,
                service: "$_id.service",
                routeName: "$_id.routeName",
                requests: 1,
                tokensUsed: 1,
                avgLatencyMs: { $round: ["$avgLatencyMs", 2] },
                errors: 1,
            },
        },
        { $sort: { service: 1, routeName: 1 } },
    ]);
    res.json({ userId, from: from || null, to: to || null, items: agg });
};
exports.myUsageSummary = myUsageSummary;
const myRecentLogs = async (req, res) => {
    const userId = req.user._id;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || "50", 10), 200));
    const logs = await requestlog_model_1.RequestLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
    res.json(logs);
};
exports.myRecentLogs = myRecentLogs;
