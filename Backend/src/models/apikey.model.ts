import mongoose, { Schema, Document } from "mongoose";

export type ApiScope =
	| "text"
	| "image"
	| "speech"
	| "embeddings"
	| "audio_transcription";

export interface IApiKey extends Document {
	userId: mongoose.Types.ObjectId;
	keyId: string; // short public identifier prefix (not secret)
	keyHash: string; // bcrypt hash of full API key
	label?: string;
	scopes: ApiScope[];
	status: "active" | "revoked";
	lastUsedAt?: Date;
	expiresAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const apiKeySchema = new Schema<IApiKey>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		keyId: { type: String, required: true, index: true },
		keyHash: { type: String, required: true, unique: true },
		label: { type: String },
		scopes: { type: [String], default: ["text"] },
		status: { type: String, enum: ["active", "revoked"], default: "active" },
		lastUsedAt: { type: Date },
		expiresAt: { type: Date },
	},
	{ timestamps: true }
);

apiKeySchema.index({ userId: 1, keyId: 1 }, { unique: true });

export const ApiKey = mongoose.model<IApiKey>("ApiKey", apiKeySchema);
