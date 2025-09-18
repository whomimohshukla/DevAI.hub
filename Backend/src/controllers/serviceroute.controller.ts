import { Request, Response } from "express";
import { ServiceRoute } from "../models/serviceroute.model";

export const listServiceRoutes = async (_req: Request, res: Response) => {
  const items = await ServiceRoute.find().sort({ service: 1, routeName: 1 });
  res.json(items);
};

export const createServiceRoute = async (req: Request, res: Response) => {
  const { service, routeName, defaultProviderModelId, allowedProviderModelIds, fallbackPolicy, enabled, version } = req.body || {};
  if (!service || !routeName || !defaultProviderModelId) return res.status(400).json({ error: "service, routeName, defaultProviderModelId are required" });
  const created = await ServiceRoute.create({ service, routeName, defaultProviderModelId, allowedProviderModelIds, fallbackPolicy, enabled, version });
  res.status(201).json(created);
};

export const updateServiceRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await ServiceRoute.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "ServiceRoute not found" });
  res.json(updated);
};

export const deleteServiceRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await ServiceRoute.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "ServiceRoute not found" });
  res.json({ ok: true });
};
