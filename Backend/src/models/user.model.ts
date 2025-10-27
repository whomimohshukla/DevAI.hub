import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	hashedPassword: string;
	role: "user" | "admin";
	credits: number;
	subscriptionPlan: "free" | "pro" | "enterprise";
	profileImage?: string;
	isActive: boolean;
	emailVerified?: Date | null;
	verificationToken?: string | null;
	verificationTokenExpires?: Date | null;
	passwordResetToken?: string | null;
	passwordResetExpires?: Date | null;
	lastLogin?: Date;
	createdAt: Date;
	updatedAt: Date;
}

// TODO: add indexes for email uniqueness
// userSchema.index({ email: 1 }, { unique: true });
const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		hashedPassword: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		credits: { type: Number, default: 100 },
		subscriptionPlan: {
			type: String,
			enum: ["free", "pro", "enterprise"],
			default: "free",
		},
		profileImage: { type: String },
		isActive: { type: Boolean, default: true },
		emailVerified: { type: Date, default: null },
		verificationToken: { type: String, default: null },
		verificationTokenExpires: { type: Date, default: null },
		passwordResetToken: { type: String, default: null },
		passwordResetExpires: { type: Date, default: null },
		lastLogin: { type: Date },
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
