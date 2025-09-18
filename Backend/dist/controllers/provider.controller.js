"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProvider = exports.updateProvider = exports.createProvider = exports.listProviders = void 0;
const provider_model_1 = require("../models/provider.model");
const listProviders = async (_req, res) => {
    const items = await provider_model_1.Provider.find().sort({ name: 1 });
    res.json(items);
};
exports.listProviders = listProviders;
const createProvider = async (req, res) => {
    const { name, baseUrl, authType, status, config } = req.body || {};
    if (!name)
        return res.status(400).json({ error: "name is required" });
    const created = await provider_model_1.Provider.create({ name, baseUrl, authType, status, config });
    res.status(201).json(created);
};
exports.createProvider = createProvider;
const updateProvider = async (req, res) => {
    const { id } = req.params;
    const updated = await provider_model_1.Provider.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
        return res.status(404).json({ error: "Provider not found" });
    res.json(updated);
};
exports.updateProvider = updateProvider;
const deleteProvider = async (req, res) => {
    const { id } = req.params;
    const deleted = await provider_model_1.Provider.findByIdAndDelete(id);
    if (!deleted)
        return res.status(404).json({ error: "Provider not found" });
    res.json({ ok: true });
};
exports.deleteProvider = deleteProvider;
