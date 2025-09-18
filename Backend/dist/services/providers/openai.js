"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiTextCompletion = openaiTextCompletion;
exports.openaiImageGenerate = openaiImageGenerate;
exports.openaiSpeechToText = openaiSpeechToText;
exports.openaiTextToSpeech = openaiTextToSpeech;
const openai_1 = __importDefault(require("openai"));
const uploads_1 = require("openai/uploads");
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    // Do not throw at import-time to allow server to start; endpoint will check.
    // console.warn("OPENAI_API_KEY is not set; /api/ai/text will fail until set.");
}
async function openaiTextCompletion(prompt, model, params) {
    if (!apiKey)
        throw new Error("OPENAI_API_KEY is not configured");
    const client = new openai_1.default({ apiKey });
    const temperature = params?.temperature ?? 0.7;
    const maxTokens = params?.max_tokens ?? 256;
    const start = Date.now();
    const res = await client.chat.completions.create({
        model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
    });
    const latencyMs = Date.now() - start;
    const text = res.choices?.[0]?.message?.content ?? "";
    const usage = res.usage || undefined;
    return {
        text,
        usage,
        latencyMs,
        raw: res,
    };
}
async function openaiImageGenerate(prompt, model, params) {
    if (!apiKey)
        throw new Error("OPENAI_API_KEY is not configured");
    const client = new openai_1.default({ apiKey });
    const size = params?.size || "1024x1024";
    const responseFormat = params?.response_format || "b64_json";
    const start = Date.now();
    const res = await client.images.generate({
        model,
        prompt,
        size,
        response_format: responseFormat,
    });
    const latencyMs = Date.now() - start;
    const b64 = res.data?.[0]?.b64_json || "";
    return { imageBase64: b64, latencyMs, raw: res };
}
async function openaiSpeechToText(audio, model, params) {
    if (!apiKey)
        throw new Error("OPENAI_API_KEY is not configured");
    const client = new openai_1.default({ apiKey });
    const start = Date.now();
    const file = await (0, uploads_1.toFile)(audio, "audio" + (params?.extension || ".wav"), { type: params?.mimeType || "audio/wav" });
    const res = await client.audio.transcriptions.create({ file, model, language: params?.language });
    const latencyMs = Date.now() - start;
    return { text: res.text, latencyMs, raw: res };
}
async function openaiTextToSpeech(text, model, voice = "alloy", format = "mp3") {
    if (!apiKey)
        throw new Error("OPENAI_API_KEY is not configured");
    const client = new openai_1.default({ apiKey });
    const start = Date.now();
    const res = await client.audio.speech.create({
        model,
        voice,
        input: text,
        format,
    });
    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const latencyMs = Date.now() - start;
    return { audioBase64: buf.toString("base64"), latencyMs };
}
