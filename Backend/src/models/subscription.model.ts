import mongoose, { Schema, Document } from "mongoose";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    status: {
      type: String,
      enum: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "incomplete",
        "incomplete_expired",
      ],
      default: "active",
    },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1 }, { unique: false });

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
