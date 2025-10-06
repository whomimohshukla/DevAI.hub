import mongoose, { Schema, Document } from "mongoose";

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  keyHash: string; 
  label?: string;
  scopes: string[]; // e.g., ["text", "image", "speech"]
  status: "active" | "revoked";
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema = new Schema<IApiKey>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    keyHash: { type: String, required: true, unique: true },
    label: { type: String },
    scopes: { type: [String], default: ["text"] },
    status: { type: String, enum: ["active", "revoked"], default: "active" },
    lastUsedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model<IApiKey>("ApiKey", apiKeySchema);
