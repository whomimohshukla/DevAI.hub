"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProviderModel = exports.updateProviderModel = exports.createProviderModel = exports.listProviderModels = void 0;
const providermodel_model_1 = require("../models/providermodel.model");
const listProviderModels = async (_req, res) => {
    const items = await providermodel_model_1.ProviderModel.find().sort({ service: 1, modelName: 1 });
    res.json(items);
};
exports.listProviderModels = listProviderModels;
const createProviderModel = async (req, res) => {
    const { providerId, modelName, service, defaultParams, pricing, status } = req.body || {};
    if (!providerId || !modelName || !service)
        return res.status(400).json({ error: "providerId, modelName, service are required" });
    const created = await providermodel_model_1.ProviderModel.create({ providerId, modelName, service, defaultParams, pricing, status });
    res.status(201).json(created);
};
exports.createProviderModel = createProviderModel;
const updateProviderModel = async (req, res) => {
    const { id } = req.params;
    const updated = await providermodel_model_1.ProviderModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
        return res.status(404).json({ error: "ProviderModel not found" });
    res.json(updated);
};
exports.updateProviderModel = updateProviderModel;
const deleteProviderModel = async (req, res) => {
    const { id } = req.params;
    const deleted = await providermodel_model_1.ProviderModel.findByIdAndDelete(id);
    if (!deleted)
        return res.status(404).json({ error: "ProviderModel not found" });
    res.json({ ok: true });
};
exports.deleteProviderModel = deleteProviderModel;
