"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.speech = exports.imageGenerate = exports.textCompletion = void 0;
const serviceroute_model_1 = require("../models/serviceroute.model");
const providermodel_model_1 = require("../models/providermodel.model");
const provider_model_1 = require("../models/provider.model");
const requestlog_model_1 = require("../models/requestlog.model");
const openai_1 = require("../services/providers/openai");
const textCompletion = async (req, res) => {
    const started = Date.now();
    const { prompt, model, params } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "prompt (string) is required" });
    }
    const route = await serviceroute_model_1.ServiceRoute.findOne({
        service: "text",
        routeName: "completion",
        enabled: true,
    });
    if (!route)
        return res.status(503).json({ error: "Service route not available" });
    let pm = await providermodel_model_1.ProviderModel.findById(route.defaultProviderModelId);
    if (model && typeof model === "string") {
        const override = await providermodel_model_1.ProviderModel.findOne({
            modelName: model,
            service: "text",
            status: "active",
        });
        if (override)
            pm = override;
    }
    if (!pm)
        return res.status(503).json({ error: "No provider model available" });
    const provider = await provider_model_1.Provider.findById(pm.providerId);
    if (!provider || provider.status !== "active") {
        return res.status(503).json({ error: "Provider unavailable" });
    }
    let resultText = "";
    let tokensUsed = 0;
    let latencyMs = 0;
    if (provider.name === "openai") {
        const out = await (0, openai_1.openaiTextCompletion)(prompt, pm.modelName, params);
        resultText = out.text;
        tokensUsed = out.usage?.total_tokens || 0;
        latencyMs = out.latencyMs || Date.now() - started;
    }
    else {
        return res
            .status(501)
            .json({ error: `Provider ${provider.name} not implemented` });
    }
    await requestlog_model_1.RequestLog.create({
        userId: req.user?._id,
        apiKeyId: req.apiKeyDoc?._id,
        service: "text",
        routeName: "completion",
        providerId: provider._id,
        providerModelId: pm._id,
        status: "success",
        httpStatus: 200,
        latencyMs,
        tokensUsed,
    });
    return res.status(200).json({
        text: resultText,
        tokensUsed,
        latencyMs,
        model: pm.modelName,
        provider: provider.name,
    });
};
exports.textCompletion = textCompletion;
const imageGenerate = async (req, res) => {
    const started = Date.now();
    const { prompt, model, params } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "prompt (string) is required" });
    }
    const route = await serviceroute_model_1.ServiceRoute.findOne({
        service: "image",
        routeName: "generation",
        enabled: true,
    });
    if (!route)
        return res.status(503).json({ error: "Service route not available" });
    let pm = await providermodel_model_1.ProviderModel.findById(route.defaultProviderModelId);
    if (model && typeof model === "string") {
        const override = await providermodel_model_1.ProviderModel.findOne({
            modelName: model,
            service: "image",
            status: "active",
        });
        if (override)
            pm = override;
    }
    if (!pm)
        return res.status(503).json({ error: "No provider model available" });
    const provider = await provider_model_1.Provider.findById(pm.providerId);
    if (!provider || provider.status !== "active") {
        return res.status(503).json({ error: "Provider unavailable" });
    }
    let imageBase64 = "";
    let latencyMs = 0;
    if (provider.name === "openai") {
        const out = await (0, openai_1.openaiImageGenerate)(prompt, pm.modelName, params);
        imageBase64 = out.imageBase64;
        latencyMs = out.latencyMs || Date.now() - started;
    }
    else {
        return res
            .status(501)
            .json({ error: `Provider ${provider.name} not implemented` });
    }
    await requestlog_model_1.RequestLog.create({
        userId: req.user?._id,
        apiKeyId: req.apiKeyDoc?._id,
        service: "image",
        routeName: "generation",
        providerId: provider._id,
        providerModelId: pm._id,
        status: "success",
        httpStatus: 200,
        latencyMs,
    });
    return res.status(200).json({
        imageBase64,
        latencyMs,
        model: pm.modelName,
        provider: provider.name,
    });
};
exports.imageGenerate = imageGenerate;
const speech = async (req, res) => {
    const started = Date.now();
    const { text, mode, model, params } = req.body || {};
    const route = await serviceroute_model_1.ServiceRoute.findOne({
        service: "speech",
        routeName: mode === "tts" ? "tts" : "transcription",
        enabled: true,
    });
    if (!route)
        return res.status(503).json({ error: "Service route not available" });
    let pm = await providermodel_model_1.ProviderModel.findById(route.defaultProviderModelId);
    if (model && typeof model === "string") {
        const override = await providermodel_model_1.ProviderModel.findOne({
            modelName: model,
            service: "speech",
            status: "active",
        });
        if (override)
            pm = override;
    }
    if (!pm)
        return res.status(503).json({ error: "No provider model available" });
    const provider = await provider_model_1.Provider.findById(pm.providerId);
    if (!provider || provider.status !== "active") {
        return res.status(503).json({ error: "Provider unavailable" });
    }
    let result = {};
    let latencyMs = 0;
    if (provider.name === "openai") {
        if (mode === "tts") {
            if (!text || typeof text !== "string") {
                return res.status(400).json({ error: "text (string) required for TTS" });
            }
            const out = await (0, openai_1.openaiTextToSpeech)(text, pm.modelName, params?.voice, params?.format);
            result = { audioBase64: out.audioBase64 };
            latencyMs = out.latencyMs || Date.now() - started;
        }
        else {
            return res.status(400).json({ error: "Audio file required for STT via multipart upload" });
        }
    }
    else {
        return res
            .status(501)
            .json({ error: `Provider ${provider.name} not implemented` });
    }
    await requestlog_model_1.RequestLog.create({
        userId: req.user?._id,
        apiKeyId: req.apiKeyDoc?._id,
        service: "speech",
        routeName: mode === "tts" ? "tts" : "transcription",
        providerId: provider._id,
        providerModelId: pm._id,
        status: "success",
        httpStatus: 200,
        latencyMs,
    });
    return res.status(200).json({
        ...result,
        latencyMs,
        model: pm.modelName,
        provider: provider.name,
    });
};
exports.speech = speech;
