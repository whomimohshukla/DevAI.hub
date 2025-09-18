import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./models/user.model";
import { ApiKey } from "./models/apikey.model";
import { Provider } from "./models/provider.model";
import { ProviderModel } from "./models/providermodel.model";
import { ServiceRoute } from "./models/serviceroute.model";
import { generateApiKey, sha256 } from "./utils/crypto";

dotenv.config({ debug: false });

async function run() {
  try {
    await connectDB();

    // Ensure provider: openai
    let provider = await Provider.findOne({ name: "openai" });
    if (!provider) {
      provider = await Provider.create({ name: "openai", authType: "apiKey", status: "active" });
      console.log("Created provider: openai");
    }

    // Ensure provider models
    // Text: gpt-4o-mini
    let pmText = await ProviderModel.findOne({ providerId: provider._id, modelName: "gpt-4o-mini", service: "text" });
    if (!pmText) {
      pmText = await ProviderModel.create({
        providerId: provider._id,
        modelName: "gpt-4o-mini",
        service: "text",
        status: "active",
        defaultParams: { temperature: 0.7, max_tokens: 256 },
      });
      console.log("Created provider model: gpt-4o-mini (text)");
    }

    // Image: gpt-image-1
    let pmImage = await ProviderModel.findOne({ providerId: provider._id, modelName: "gpt-image-1", service: "image" });
    if (!pmImage) {
      pmImage = await ProviderModel.create({
        providerId: provider._id,
        modelName: "gpt-image-1",
        service: "image",
        status: "active",
        defaultParams: { size: "1024x1024" },
      });
      console.log("Created provider model: gpt-image-1 (image)");
    }

    // Speech STT: whisper-1
    let pmSTT = await ProviderModel.findOne({ providerId: provider._id, modelName: "whisper-1", service: "speech" });
    if (!pmSTT) {
      pmSTT = await ProviderModel.create({
        providerId: provider._id,
        modelName: "whisper-1",
        service: "speech",
        status: "active",
      });
      console.log("Created provider model: whisper-1 (speech STT)");
    }

    // Speech TTS: tts-1
    let pmTTS = await ProviderModel.findOne({ providerId: provider._id, modelName: "tts-1", service: "speech" });
    if (!pmTTS) {
      pmTTS = await ProviderModel.create({
        providerId: provider._id,
        modelName: "tts-1",
        service: "speech",
        status: "active",
      });
      console.log("Created provider model: tts-1 (speech TTS)");
    }

    // Ensure service route: text completion
    let routeText = await ServiceRoute.findOne({ service: "text", routeName: "completion" });
    if (!routeText) {
      routeText = await ServiceRoute.create({
        service: "text",
        routeName: "completion",
        defaultProviderModelId: pmText._id,
        allowedProviderModelIds: [pmText._id],
        fallbackPolicy: "priority",
        enabled: true,
      });
      console.log("Created service route: text/completion");
    }

    // Ensure service route: image generation
    let routeImage = await ServiceRoute.findOne({ service: "image", routeName: "generation" });
    if (!routeImage) {
      routeImage = await ServiceRoute.create({
        service: "image",
        routeName: "generation",
        defaultProviderModelId: pmImage._id,
        allowedProviderModelIds: [pmImage._id],
        fallbackPolicy: "priority",
        enabled: true,
      });
      console.log("Created service route: image/generation");
    }

    // Ensure service routes: speech stt and tts
    let routeSTT = await ServiceRoute.findOne({ service: "speech", routeName: "stt" });
    if (!routeSTT) {
      routeSTT = await ServiceRoute.create({
        service: "speech",
        routeName: "stt",
        defaultProviderModelId: pmSTT._id,
        allowedProviderModelIds: [pmSTT._id],
        fallbackPolicy: "priority",
        enabled: true,
      });
      console.log("Created service route: speech/stt");
    }
    let routeTTS = await ServiceRoute.findOne({ service: "speech", routeName: "tts" });
    if (!routeTTS) {
      routeTTS = await ServiceRoute.create({
        service: "speech",
        routeName: "tts",
        defaultProviderModelId: pmTTS._id,
        allowedProviderModelIds: [pmTTS._id],
        fallbackPolicy: "priority",
        enabled: true,
      });
      console.log("Created service route: speech/tts");
    }

    // Create demo user if not exists
    let user = await User.findOne({ email: "demo@example.com" });
    if (!user) {
      user = await User.create({
        name: "Demo User",
        email: "demo@example.com",
        password: "demo-password", // In production, hash passwords!
        role: "user",
      });
      console.log("Created demo user: demo@example.com");
    }

    // Create API key for demo user if none exists
    const existingKey = await ApiKey.findOne({ userId: user._id, status: "active" });
    if (!existingKey) {
      const raw = generateApiKey();
      const keyHash = sha256(raw);
      await ApiKey.create({ userId: user._id, keyHash, scopes: ["text"], status: "active" });
      console.log("Created API key for demo user:", raw);
      console.log("Store this key securely. It will not be shown again.");
    } else {
      console.log("Demo user already has an active API key.");
    }

    console.log("Seed complete.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

run();
