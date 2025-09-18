import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: "user" | "admin";
	credits: number;
	subscriptionPlan: "free" | "pro" | "enterprise";
	profileImage?: string;
	isActive: boolean;
	lastLogin?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		credits: { type: Number, default: 100 },
		subscriptionPlan: {
			type: String,
			enum: ["free", "pro", "enterprise"],
			default: "free",
		},
		profileImage: { type: String },
		isActive: { type: Boolean, default: true },
		lastLogin: { type: Date },
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
