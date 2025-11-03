import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
	userId: mongoose.Types.ObjectId;
	sessionTokenHash: string; // bcrypt hash of opaque session token
	userAgent?: string;
	ip?: string;
	expiresAt: Date;
	revokedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		sessionTokenHash: { type: String, required: true, unique: true },
		userAgent: { type: String },
		ip: { type: String },
		expiresAt: { type: Date, required: true, index: true },
		revokedAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);
