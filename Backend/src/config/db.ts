import mongoose from "mongoose";

export async function connectDB(uri?: string) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }
  mongoose.set("strictQuery", true);

  // Helpful connection event logs
  mongoose.connection.on("connected", () => {
    try {
      const masked = maskMongoUri(mongoUri);
      console.log(`[DB] Connected to ${masked}`);
    } catch {
      console.log("[DB] Connected to MongoDB");
    }
  });
  mongoose.connection.on("error", (err) => {
    console.error("[DB] MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[DB] MongoDB disconnected");
  });

  // Attempt to connect
  try {
    await mongoose.connect(mongoUri);
    // Optional ping to ensure connectivity
    // Ping only if db handle is present (TS-safe optional chaining)
    await mongoose.connection.db?.admin().ping();
    return mongoose.connection;
  } catch (err) {
    console.error("[DB] Failed to connect to MongoDB:", (err as Error).message);
    throw err;
  }
}

function maskMongoUri(uri: string) {
  try {
    // Mask credentials in URI for logging
    const u = new URL(uri.replace("mongodb+srv://", "https://").replace("mongodb://", "http://"));
    if (u.password) {
      u.password = "****";
    }
    if (u.username) {
      u.username = "****";
    }
    const proto = uri.startsWith("mongodb+srv://") ? "mongodb+srv://" : "mongodb://";
    return proto + (u.username ? `${u.username}:${u.password}@` : "") + u.host + u.pathname;
  } catch {
    return "mongodb://<masked>";
  }
}
