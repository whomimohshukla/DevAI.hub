import OpenAI from "openai";
import { toFile } from "openai/uploads";

const apiKey = process.env.OPENAI_API_KEY;

export async function openaiTextCompletion(
  prompt: string,
  model: string,
  params?: Record<string, unknown>
) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const temperature = (params?.temperature as number) ?? 0.7;
  const maxTokens = (params?.max_tokens as number) ?? 256;
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
  const usage = res.usage ?? undefined;
  return { text, usage, latencyMs, raw: res };
}

export async function openaiImageGenerate(
  prompt: string,
  model: string,
  params?: Record<string, unknown>
) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const size = (params?.size as "1024x1024") || "1024x1024";
  const start = Date.now();
  const res = await client.images.generate({ model, prompt, size, response_format: "b64_json" });
  const latencyMs = Date.now() - start;
  const b64 = res.data?.[0]?.b64_json || "";
  return { imageBase64: b64, latencyMs, raw: res };
}

export async function openaiSpeechToText(
  audio: Buffer,
  model: string,
  params?: Record<string, unknown>
) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const start = Date.now();
  const file = await toFile(
    audio,
    "audio" + ((params?.extension as string) || ".wav"),
    { type: (params?.mimeType as string) || "audio/wav" }
  );
  const res = await client.audio.transcriptions.create({
    file,
    model,
    language: params?.language as string | undefined,
  });
  const latencyMs = Date.now() - start;
  return { text: res.text, latencyMs, raw: res };
}

export async function openaiTextToSpeech(
  text: string,
  model: string,
  voice = "alloy",
  format = "mp3"
) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const client = new OpenAI({ apiKey });
  const start = Date.now();
  const res = await client.audio.speech.create({
    model,
    voice: voice as "alloy",
    input: text,
    response_format: format as "mp3",
  });
  const arrayBuffer = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  const latencyMs = Date.now() - start;
  return { audioBase64: buf.toString("base64"), latencyMs };
}
