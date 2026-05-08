import { Request, Response } from "express";
import { ServiceRoute } from "../models/serviceroute.model";
import { ProviderModel } from "../models/providermodel.model";
import { Provider } from "../models/provider.model";
import { RequestLog } from "../models/requestlog.model";
import {
  openaiTextCompletion,
  openaiImageGenerate,
  openaiSpeechToText,
  openaiTextToSpeech,
} from "../services/providers/openai";

export const textCompletion = async (req: Request, res: Response) => {
  const started = Date.now();
  const { prompt, model, params } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt (string) is required" });
  }
  const route = await ServiceRoute.findOne({
    service: "text",
    routeName: "completion",
    enabled: true,
  });
  if (!route)
    return res.status(503).json({ error: "Service route not available" });
  let pm = await ProviderModel.findById(route.defaultProviderModelId);
  if (model && typeof model === "string") {
    const override = await ProviderModel.findOne({
      modelName: model,
      service: "text",
      status: "active",
    });
    if (override) pm = override;
  }
  if (!pm) return res.status(503).json({ error: "No provider model available" });
  const provider = await Provider.findById(pm.providerId);
  if (!provider || provider.status !== "active") {
    return res.status(503).json({ error: "Provider unavailable" });
  }
  let resultText = "";
  let tokensUsed = 0;
  let latencyMs = 0;
  if (provider.name === "openai") {
    const out = await openaiTextCompletion(prompt, pm.modelName, params);
    resultText = out.text;
    tokensUsed = out.usage?.total_tokens || 0;
    latencyMs = out.latencyMs || Date.now() - started;
  } else {
    return res
      .status(501)
      .json({ error: `Provider ${provider.name} not implemented` });
  }
  await RequestLog.create({
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

export const imageGenerate = async (req: Request, res: Response) => {
  const started = Date.now();
  const { prompt, model, params } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt (string) is required" });
  }
  const route = await ServiceRoute.findOne({
    service: "image",
    routeName: "generation",
    enabled: true,
  });
  if (!route)
    return res.status(503).json({ error: "Service route not available" });
  let pm = await ProviderModel.findById(route.defaultProviderModelId);
  if (model && typeof model === "string") {
    const override = await ProviderModel.findOne({
      modelName: model,
      service: "image",
      status: "active",
    });
    if (override) pm = override;
  }
  if (!pm) return res.status(503).json({ error: "No provider model available" });
  const provider = await Provider.findById(pm.providerId);
  if (!provider || provider.status !== "active") {
    return res.status(503).json({ error: "Provider unavailable" });
  }
  let imageBase64 = "";
  let latencyMs = 0;
  if (provider.name === "openai") {
    const out = await openaiImageGenerate(prompt, pm.modelName, params);
    imageBase64 = out.imageBase64;
    latencyMs = out.latencyMs || Date.now() - started;
  } else {
    return res
      .status(501)
      .json({ error: `Provider ${provider.name} not implemented` });
  }
  await RequestLog.create({
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

export const speech = async (req: Request, res: Response) => {
  const started = Date.now();
  const { text, mode, model, params } = req.body || {};
  const route = await ServiceRoute.findOne({
    service: "speech",
    routeName: mode === "tts" ? "tts" : "transcription",
    enabled: true,
  });
  if (!route)
    return res.status(503).json({ error: "Service route not available" });
  let pm = await ProviderModel.findById(route.defaultProviderModelId);
  if (model && typeof model === "string") {
    const override = await ProviderModel.findOne({
      modelName: model,
      service: "speech",
      status: "active",
    });
    if (override) pm = override;
  }
  if (!pm) return res.status(503).json({ error: "No provider model available" });
  const provider = await Provider.findById(pm.providerId);
  if (!provider || provider.status !== "active") {
    return res.status(503).json({ error: "Provider unavailable" });
  }
  let result: Record<string, unknown> = {};
  let latencyMs = 0;
  if (provider.name === "openai") {
    if (mode === "tts") {
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "text (string) required for TTS" });
      }
      const out = await openaiTextToSpeech(
        text,
        pm.modelName,
        params?.voice as string,
        params?.format as string
      );
      result = { audioBase64: out.audioBase64 };
      latencyMs = out.latencyMs || Date.now() - started;
    } else {
      return res.status(400).json({ error: "Audio file required for STT via multipart upload" });
    }
  } else {
    return res
      .status(501)
      .json({ error: `Provider ${provider.name} not implemented` });
  }
  await RequestLog.create({
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
