import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";
import { ServiceRoute } from "../models/serviceroute.model";
import { ProviderModel } from "../models/providermodel.model";
import { Provider } from "../models/provider.model";
import { RequestLog } from "../models/requestlog.model";
import { openaiImageGenerate, openaiSpeechToText, openaiTextCompletion, openaiTextToSpeech } from "../services/providers/openai";
import { fetchBuffer } from "../utils/http";

export const textCompletion = async (req: AuthedRequest, res: Response) => {
  const started = Date.now();
  const { prompt, model, params } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt (string) is required" });
  }

  const route = await ServiceRoute.findOne({ service: "text", routeName: "completion", enabled: true });
  if (!route) return res.status(503).json({ error: "Service route not available" });

  let pm = await ProviderModel.findById(route.defaultProviderModelId);
  if (model && typeof model === "string") {
    const override = await ProviderModel.findOne({ modelName: model, service: "text", status: "active" });
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
    tokensUsed = (out.usage?.total_tokens as number) || 0;
    latencyMs = out.latencyMs || Date.now() - started;
  } else {
    return res.status(501).json({ error: `Provider ${provider.name} not implemented` });
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

  return res.status(200).json({ text: resultText, tokensUsed, latencyMs, model: pm.modelName, provider: provider.name });
};

export const imageGenerate = async (req: AuthedRequest, res: Response) => {
  const started = Date.now();
  const { prompt, model, params } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt (string) is required" });
  }

  const route = await ServiceRoute.findOne({ service: "image", routeName: "generation", enabled: true });
  if (!route) return res.status(503).json({ error: "Service route not available" });

  let pm = await ProviderModel.findById(route.defaultProviderModelId);
  if (model && typeof model === "string") {
    const override = await ProviderModel.findOne({ modelName: model, service: "image", status: "active" });
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
    return res.status(501).json({ error: `Provider ${provider.name} not implemented` });
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

  return res.status(200).json({ imageBase64, latencyMs, model: pm.modelName, provider: provider.name });
};

export const speech = async (req: AuthedRequest, res: Response) => {
  const started = Date.now();
  const { action } = req.body || {};
  if (!action || (action !== "stt" && action !== "tts")) {
    return res.status(400).json({ error: "action must be 'stt' or 'tts'" });
  }

  const routeName = action === "stt" ? "stt" : "tts";
  const route = await ServiceRoute.findOne({ service: "speech", routeName, enabled: true });
  if (!route) return res.status(503).json({ error: "Service route not available" });

  const { model, params } = req.body || {};
  let pm = await ProviderModel.findById(route.defaultProviderModelId);
  if (model && typeof model === "string") {
    const override = await ProviderModel.findOne({ modelName: model, service: "speech", status: "active" });
    if (override) pm = override;
  }
  if (!pm) return res.status(503).json({ error: "No provider model available" });

  const provider = await Provider.findById(pm.providerId);
  if (!provider || provider.status !== "active") {
    return res.status(503).json({ error: "Provider unavailable" });
  }

  if (action === "stt") {
    // Input can be audioBase64 or audioUrl
    const { audioBase64, audioUrl } = req.body || {};
    let audioBuf: Buffer | null = null;
    if (audioBase64 && typeof audioBase64 === "string") {
      audioBuf = Buffer.from(audioBase64, "base64");
    } else if (audioUrl && typeof audioUrl === "string") {
      audioBuf = await fetchBuffer(audioUrl);
    } else {
      return res.status(400).json({ error: "Provide audioBase64 or audioUrl" });
    }

    const out = await openaiSpeechToText(audioBuf, pm.modelName, params);
    const latencyMs = out.latencyMs || Date.now() - started;

    await RequestLog.create({
      userId: req.user?._id,
      apiKeyId: req.apiKeyDoc?._id,
      service: "speech",
      routeName: "stt",
      providerId: provider._id,
      providerModelId: pm._id,
      status: "success",
      httpStatus: 200,
      latencyMs,
    });

    return res.status(200).json({ text: out.text, latencyMs, model: pm.modelName, provider: provider.name });
  } else {
    // TTS
    const { text, voice, format } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text (string) is required for tts" });
    }
    const out = await openaiTextToSpeech(text, pm.modelName, voice, format);
    const latencyMs = out.latencyMs || Date.now() - started;

    await RequestLog.create({
      userId: req.user?._id,
      apiKeyId: req.apiKeyDoc?._id,
      service: "speech",
      routeName: "tts",
      providerId: provider._id,
      providerModelId: pm._id,
      status: "success",
      httpStatus: 200,
      latencyMs,
    });

    return res.status(200).json({ audioBase64: out.audioBase64, latencyMs, model: pm.modelName, provider: provider.name });
  }
};
