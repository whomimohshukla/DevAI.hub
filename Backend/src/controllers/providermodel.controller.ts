import { Request, Response } from "express";
import { ProviderModel } from "../models/providermodel.model";


// get all provider models
export const listProviderModels = async (_req: Request, res: Response) => {
  const items = await ProviderModel.find().sort({ service: 1, modelName: 1 });
  res.json(items);
};


// create a new provider model

export const createProviderModel = async (req: Request, res: Response) => {
  const { providerId, modelName, service, defaultParams, pricing, status } = req.body || {};
  if (!providerId || !modelName || !service)
    return res.status(400).json({ error: "providerId, modelName, service are required" });
  const created = await ProviderModel.create({ providerId, modelName, service, defaultParams, pricing, status });
  res.status(201).json(created);
};


// update the provider model by id
export const updateProviderModel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await ProviderModel.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "ProviderModel not found" });
  res.json(updated);
};


// delete the provider model by id
export const deleteProviderModel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await ProviderModel.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "ProviderModel not found" });
  res.json({ ok: true });
};
