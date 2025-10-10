import OpenAI from "openai";
import { toFile } from "openai/uploads";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // Do not throw at import-time to allow server to start; endpoint will check.
  // console.warn("OPENAI_API_KEY is not set; /api/ai/text will fail until set.");
}


// TODO: add support for streaming
export async function openaiTextCompletion(prompt: string, model: string, params?: Record<string, any>) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });

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


// TODO: add support for streaming
export async function openaiImageGenerate(prompt: string, model: string, params?: Record<string, any>) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const size = params?.size || "1024x1024";
  const responseFormat = params?.response_format || "b64_json";

  const start = Date.now();
  const res = await client.images.generate({
    model,
    prompt,
    size,
    response_format: responseFormat as any,
  });
  const latencyMs = Date.now() - start;
  const b64 = res.data?.[0]?.b64_json || "";
  return { imageBase64: b64, latencyMs, raw: res };
}


// TODO: add support for streaming
export async function openaiSpeechToText(audio: Buffer, model: string, params?: Record<string, any>) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const start = Date.now();
  const file = await toFile(audio, "audio" + (params?.extension || ".wav"), { type: params?.mimeType || "audio/wav" });
  const res = await client.audio.transcriptions.create({ file, model, language: params?.language } as any);
  const latencyMs = Date.now() - start;
  return { text: (res as any).text as string, latencyMs, raw: res };
}

// TODO: add support for streaming

export async function openaiTextToSpeech(text: string, model: string, voice: string = "alloy", format: "mp3" | "wav" = "mp3") {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const start = Date.now();
  const res = await client.audio.speech.create({
    model,
    voice,
    input: text,
    format,
  } as any);
  const arrayBuffer = await (res as any).arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  const latencyMs = Date.now() - start;
  return { audioBase64: buf.toString("base64"), latencyMs };
}
