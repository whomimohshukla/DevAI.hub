import mongoose, { Schema, Document } from "mongoose";

export interface IProviderModel extends Document {
	providerId: mongoose.Types.ObjectId;
	modelName: string; // e.g., "gpt-4o-mini"
	service: "text" | "image" | "speech" | "embeddings" | "audio_transcription";
	defaultParams?: Record<string, any>;
	pricing?: {
		unit: "token" | "request" | "minute";
		inputPerUnitCents?: number;
		outputPerUnitCents?: number;
		perRequestCents?: number;
	};
	status: "active" | "inactive";
	createdAt: Date;
	updatedAt: Date;
}

// TODO: add indexes for providerId + modelName uniqueness
const providerModelSchema = new Schema<IProviderModel>(
	{
		providerId: {
			type: Schema.Types.ObjectId,
			ref: "Provider",
			required: true,
		},
		modelName: { type: String, required: true },
		service: {
			type: String,
			enum: ["text", "image", "speech", "embeddings", "audio_transcription"],
			required: true,
		},
		defaultParams: { type: Schema.Types.Mixed },
		pricing: {
			unit: {
				type: String,
				enum: ["token", "request", "minute"],
				default: "token",
			},
			inputPerUnitCents: { type: Number },
			outputPerUnitCents: { type: Number },
			perRequestCents: { type: Number },
		},
		status: { type: String, enum: ["active", "inactive"], default: "active" },
	},
	{ timestamps: true }
);

providerModelSchema.index({ providerId: 1, modelName: 1 }, { unique: true });

export const ProviderModel = mongoose.model<IProviderModel>(
	"ProviderModel",
	providerModelSchema
);
