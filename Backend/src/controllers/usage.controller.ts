import { Request, Response } from "express";
import { RequestLog } from "../models/requestlog.model";

export const myUsageSummary = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { from, to } = req.query as { from?: string; to?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match: Record<string, any> = { userId };
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }
  const agg = await RequestLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: { service: "$service", routeName: "$routeName" },
        requests: { $sum: 1 },
        tokensUsed: { $sum: { $ifNull: ["$tokensUsed", 0] } },
        avgLatencyMs: { $avg: { $ifNull: ["$latencyMs", 0] } },
        errors: {
          $sum: { $cond: [{ $eq: ["$status", "error"] }, 1, 0] },
        },
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
  return res.json({ userId, from: from || null, to: to || null, items: agg });
};

export const myRecentLogs = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const limit = Math.max(
    1,
    Math.min(parseInt((req.query.limit as string) || "50", 10), 200)
  );
  const logs = await RequestLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
  return res.json(logs);
};
