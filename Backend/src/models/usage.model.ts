import mongoose, { Schema, Document } from "mongoose";

export interface IUsage extends Document {
	userId: mongoose.Types.ObjectId;
	service: "text" | "image" | "speech" | "embeddings" | "audio_transcription";
	routeName: string; // e.g., "completion", "generation", "stt", "tts"
	requests: number;
	tokensUsed: number;
	costInCents?: number;
	windowStart?: Date;
	windowEnd?: Date;
	billingCycle: "daily" | "monthly";
	resetDate?: Date;
	lastUsedAt: Date;
}

// TODO: add indexes for userId + service + routeName uniqueness
const usageSchema = new Schema<IUsage>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		service: { type: String, enum: ["text", "image", "speech", "embeddings", "audio_transcription"], required: true },
		routeName: { type: String, required: true },
		requests: { type: Number, default: 0 },
		tokensUsed: { type: Number, default: 0 },
		costInCents: { type: Number, default: 0 },
		windowStart: { type: Date },
		windowEnd: { type: Date },
		billingCycle: {
			type: String,
			enum: ["daily", "monthly"],
			default: "monthly",
		},
		resetDate: { type: Date },
		lastUsedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

usageSchema.index({ userId: 1, service: 1, routeName: 1 });

export const Usage = mongoose.model<IUsage>("Usage", usageSchema);
