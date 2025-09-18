"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceRoute = exports.updateServiceRoute = exports.createServiceRoute = exports.listServiceRoutes = void 0;
const serviceroute_model_1 = require("../models/serviceroute.model");
const listServiceRoutes = async (_req, res) => {
    const items = await serviceroute_model_1.ServiceRoute.find().sort({ service: 1, routeName: 1 });
    res.json(items);
};
exports.listServiceRoutes = listServiceRoutes;
const createServiceRoute = async (req, res) => {
    const { service, routeName, defaultProviderModelId, allowedProviderModelIds, fallbackPolicy, enabled, version } = req.body || {};
    if (!service || !routeName || !defaultProviderModelId)
        return res.status(400).json({ error: "service, routeName, defaultProviderModelId are required" });
    const created = await serviceroute_model_1.ServiceRoute.create({ service, routeName, defaultProviderModelId, allowedProviderModelIds, fallbackPolicy, enabled, version });
    res.status(201).json(created);
};
exports.createServiceRoute = createServiceRoute;
const updateServiceRoute = async (req, res) => {
    const { id } = req.params;
    const updated = await serviceroute_model_1.ServiceRoute.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated)
        return res.status(404).json({ error: "ServiceRoute not found" });
    res.json(updated);
};
exports.updateServiceRoute = updateServiceRoute;
const deleteServiceRoute = async (req, res) => {
    const { id } = req.params;
    const deleted = await serviceroute_model_1.ServiceRoute.findByIdAndDelete(id);
    if (!deleted)
        return res.status(404).json({ error: "ServiceRoute not found" });
    res.json({ ok: true });
};
exports.deleteServiceRoute = deleteServiceRoute;
