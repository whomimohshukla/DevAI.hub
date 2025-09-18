import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: "free" | "pro" | "enterprise" | string;
  description?: string;
  monthlyPriceCents: number; // 0 for free
  yearlyPriceCents?: number;
  features: string[];
  limits: {
    requestsPerDay?: number;
    tokensPerMonth?: number;
    imagesPerMonth?: number;
    speechMinutesPerMonth?: number;
  };
  stripePriceIdMonthly?: string; // Stripe Price for monthly
  stripePriceIdYearly?: string; // Stripe Price for yearly
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    monthlyPriceCents: { type: Number, required: true },
    yearlyPriceCents: { type: Number },
    features: { type: [String], default: [] },
    limits: {
      requestsPerDay: { type: Number },
      tokensPerMonth: { type: Number },
      imagesPerMonth: { type: Number },
      speechMinutesPerMonth: { type: Number },
    },
    stripePriceIdMonthly: { type: String },
    stripePriceIdYearly: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan = mongoose.model<IPlan>("Plan", planSchema);
