import mongoose, { Schema, Document } from "mongoose";

export interface IServiceRoute extends Document {
	service: "text" | "image" | "speech" | "embeddings" | "audio_transcription";
	routeName: string; // e.g., "completion"
	defaultProviderModelId: mongoose.Types.ObjectId; // ref ProviderModel
	allowedProviderModelIds: mongoose.Types.ObjectId[]; // refs ProviderModel
	fallbackPolicy: "priority" | "round_robin";
	enabled: boolean;
	version?: string;
	createdAt: Date;
	updatedAt: Date;
}

const serviceRouteSchema = new Schema<IServiceRoute>(
	{
		service: {
			type: String,
			enum: ["text", "image", "speech", "embeddings", "audio_transcription"],
			required: true,
		},
		routeName: { type: String, required: true },
		defaultProviderModelId: {
			type: Schema.Types.ObjectId,
			ref: "ProviderModel",
			required: true,
		},
		allowedProviderModelIds: [
			{ type: Schema.Types.ObjectId, ref: "ProviderModel" },
		],
		fallbackPolicy: {
			type: String,
			enum: ["priority", "round_robin"],
			default: "priority",
		},
		enabled: { type: Boolean, default: true },
		version: { type: String, default: "1.0" },
	},
	{ timestamps: true }
);

serviceRouteSchema.index({ service: 1, routeName: 1 }, { unique: true });

export const ServiceRoute = mongoose.model<IServiceRoute>(
	"ServiceRoute",
	serviceRouteSchema
);
