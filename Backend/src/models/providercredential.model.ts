import mongoose, { Schema, Document } from "mongoose";

export type ProviderCredentialScope =
  | "text"
  | "image"
  | "speech"
  | "embeddings"
  | "audio_transcription";

export interface IProviderCredential extends Document {
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  keyId: string; // short public identifier prefix (not secret)
  keyHash: string; // bcrypt hash of provider API key
  label?: string;
  scopes: ProviderCredentialScope[];
  status: "active" | "revoked";
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const providerCredentialSchema = new Schema<IProviderCredential>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true, index: true },
    keyId: { type: String, required: true, index: true },
    keyHash: { type: String, required: true },
    label: { type: String },
    scopes: { type: [String], default: ["text"] },
    status: { type: String, enum: ["active", "revoked"], default: "active" },
    lastUsedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

providerCredentialSchema.index({ userId: 1, providerId: 1, keyId: 1 }, { unique: true });

export const ProviderCredential = mongoose.model<IProviderCredential>(
  "ProviderCredential",
  providerCredentialSchema
);
