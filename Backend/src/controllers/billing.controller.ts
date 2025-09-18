import { Response } from "express";
import Stripe from "stripe";
import { AuthedRequest } from "../middleware/auth";
import { Plan } from "../models/plan.model";
import { Subscription } from "../models/subscription.model";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
export const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" as any });

export const createCheckoutSession = async (req: AuthedRequest, res: Response) => {
  const { planName, interval } = req.body || {};
  if (!planName || (interval !== "month" && interval !== "year")) {
    return res.status(400).json({ error: "planName and interval ('month'|'year') are required" });
  }
  const plan = await Plan.findOne({ name: planName, isActive: true });
  if (!plan) return res.status(404).json({ error: "Plan not found" });

  const priceId = interval === "month" ? plan.stripePriceIdMonthly : plan.stripePriceIdYearly;
  if (!priceId) return res.status(400).json({ error: `No Stripe price configured for ${interval}` });

  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });

  // Ensure customer
  const existing = await Subscription.findOne({ userId: req.user._id });
  let customerId = existing?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name,
      metadata: { userId: String(req.user._id) },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/billing/cancel`,
    metadata: { userId: String(req.user._id), planName },
  });

  return res.json({ url: session.url });
};

export const createPortalSession = async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const sub = await Subscription.findOne({ userId: req.user._id });
  if (!sub?.stripeCustomerId) return res.status(400).json({ error: "No Stripe customer found" });

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${process.env.APP_URL}/dashboard/billing`,
  });

  return res.json({ url: portal.url });
};
