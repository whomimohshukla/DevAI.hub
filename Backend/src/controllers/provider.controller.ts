import { Request, Response } from "express";
import { Provider } from "../models/provider.model";


// get all providers
export const listProviders = async (_req: Request, res: Response) => {
  const items = await Provider.find().sort({ name: 1 });
  res.json(items);
};


// create a new provider
export const createProvider = async (req: Request, res: Response) => {
  const { name, baseUrl, authType, status, config } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });
  const created = await Provider.create({ name, baseUrl, authType, status, config });
  res.status(201).json(created);
};

// update the provider by id
export const updateProvider = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await Provider.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Provider not found" });
  res.json(updated);
};
 
// delete the provider by id
export const deleteProvider = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Provider.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "Provider not found" });
  res.json({ ok: true });
};
