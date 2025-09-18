import mongoose, { Schema, Document } from "mongoose";

export interface IProvider extends Document {
  name: string; // "openai" | "huggingface" | "stability" | etc
  baseUrl?: string;
  authType: "none" | "apiKey" | "oauth";
  status: "active" | "inactive";
  config?: Record<string, any>;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true, unique: true },
    baseUrl: { type: String },
    authType: { type: String, enum: ["none", "apiKey", "oauth"], default: "apiKey" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    config: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Provider = mongoose.model<IProvider>("Provider", providerSchema);
