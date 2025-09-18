import mongoose from "mongoose";

export async function connectDB(uri?: string) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}
