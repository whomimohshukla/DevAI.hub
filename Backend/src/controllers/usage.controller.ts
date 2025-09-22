import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";
import { RequestLog } from "../models/requestlog.model";


// get usage summary for the authenticated user
export const myUsageSummary = async (req: AuthedRequest, res: Response) => {
  const userId = req.user!._id;
  const { from, to } = req.query as { from?: string; to?: string };
  const match: any = { userId };
  if (from || to) {
    match.createdAt = {} as any;
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


// get recent request logs for the authenticated user
export const myRecentLogs = async (req: AuthedRequest, res: Response) => {
  const userId = req.user!._id;
  const limit = Math.max(1, Math.min(parseInt((req.query.limit as string) || "50", 10), 200));
  const logs = await RequestLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  res.json(logs);
};
