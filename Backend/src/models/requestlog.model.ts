import mongoose, { Schema, Document } from "mongoose";

export interface IRequestLog extends Document {
  userId?: mongoose.Types.ObjectId;
  apiKeyId?: mongoose.Types.ObjectId;
  service: "text" | "image" | "speech";
  routeName: string;
  providerId?: mongoose.Types.ObjectId;
  providerModelId?: mongoose.Types.ObjectId;
  status: "success" | "error" | "rate_limited";
  httpStatus?: number;
  latencyMs?: number;
  tokensUsed?: number;
  inputChars?: number;
  outputChars?: number;
  costInCents?: number;
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const requestLogSchema = new Schema<IRequestLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    apiKeyId: { type: Schema.Types.ObjectId, ref: "ApiKey" },
    service: { type: String, enum: ["text", "image", "speech"], required: true },
    routeName: { type: String, required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Provider" },
    providerModelId: { type: Schema.Types.ObjectId, ref: "ProviderModel" },
    status: { type: String, enum: ["success", "error", "rate_limited"], required: true },
    httpStatus: { type: Number },
    latencyMs: { type: Number },
    tokensUsed: { type: Number },
    inputChars: { type: Number },
    outputChars: { type: Number },
    costInCents: { type: Number },
    errorCode: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const RequestLog = mongoose.model<IRequestLog>(
  "RequestLog",
  requestLogSchema
);
