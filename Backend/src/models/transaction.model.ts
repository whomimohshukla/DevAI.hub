import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
	userId: mongoose.Types.ObjectId;
	amount: number;
	currency: string;
	type: "credit" | "debit";
	status: "pending" | "success" | "failed";
	paymentMethod?: string;
	transactionId?: string;
	description?: string;
	createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		amount: { type: Number, required: true },
		currency: { type: String, default: "USD" },
		type: { type: String, enum: ["credit", "debit"], required: true },
		status: {
			type: String,
			enum: ["pending", "success", "failed"],
			default: "pending",
		},
		paymentMethod: { type: String },
		transactionId: { type: String },
		description: { type: String },
	},
	{ timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
	"Transaction",
	transactionSchema
);
