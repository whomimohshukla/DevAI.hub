import express, { Router } from "express";
import Stripe from "stripe";
import { Subscription } from "../models/subscription.model";
import { Plan } from "../models/plan.model";
import { User } from "../models/user.model";
import { Webhook, WebhookRequiredHeaders } from "svix";

const router = Router();

// Stripe webhook: use raw body parser for this route
const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" as any });
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"] as string | undefined;
      if (!sig || !stripeWebhookSecret) return res.status(400).send("Missing signature or secret");
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body as Buffer, sig, stripeWebhookSecret);
      } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const subscriptionId = session.subscription as string | undefined;
          const customerId = session.customer as string | undefined;
          const userId = session.metadata?.userId;
          const planName = session.metadata?.planName;
          if (subscriptionId && userId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = sub.items.data[0]?.price?.id;
            // Find plan by price id or fallback to planName
            let plan = await Plan.findOne({ $or: [{ stripePriceIdMonthly: priceId }, { stripePriceIdYearly: priceId }, { name: planName }] });
            if (!plan) plan = await Plan.findOne({ name: "free" });
            if (plan) {
              await Subscription.findOneAndUpdate(
                { userId },
                {
                  userId,
                  planId: plan._id,
                  status: sub.status as any,
                  currentPeriodStart: new Date(sub.current_period_start * 1000),
                  currentPeriodEnd: new Date(sub.current_period_end * 1000),
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscriptionId,
                },
                { upsert: true, new: true }
              );
            }
          }
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.created":
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          const userId = sub.metadata?.userId;
          if (userId) {
            await Subscription.findOneAndUpdate(
              { userId },
              {
                status: sub.status as any,
                currentPeriodStart: new Date(sub.current_period_start * 1000),
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
                stripeSubscriptionId: sub.id,
              }
            );
          }
          break;
        }
        default:
          break;
      }

      return res.json({ received: true });
    } catch (e) {
      return res.status(500).send("Webhook handling error");
    }
  }
);

// Clerk webhook (via Svix) for user provisioning and role assignment
// Set env: CLERK_WEBHOOK_SECRET
router.post("/clerk", express.json({ type: "application/json" }), async (req, res) => {
  const payload = req.body;
  // Build the exact headers object Svix expects, avoiding unsafe casting
  const headers: WebhookRequiredHeaders = {
    "svix-id": req.header("svix-id") || "",
    "svix-timestamp": req.header("svix-timestamp") || "",
    "svix-signature": req.header("svix-signature") || "",
  };
  const secret = process.env.CLERK_WEBHOOK_SECRET || "";
  if (!secret) return res.status(400).json({ error: "Missing CLERK_WEBHOOK_SECRET" });
  try {
    const wh = new Webhook(secret);
    wh.verify(JSON.stringify(payload), headers);

    if (payload.type === "user.created" || payload.type === "user.updated") {
      const user = payload.data;
      const userId = user.id as string;
      const email = (user.primary_email_address?.email_address || user.email_addresses?.[0]?.email_address) as string | undefined;
      const name = (user.full_name || user.first_name || email || `user_${userId}`) as string;
      const imageUrl = user.image_url as string | undefined;

      let local = await User.findOne({ clerkUserId: userId });
      if (!local) {
        local = await User.findOne({ email: email || `unknown+${userId}@example.com` });
      }
      if (!local) {
        local = await User.create({
          name,
          email: email || `unknown+${userId}@example.com`,
          password: "",
          clerkUserId: userId,
          role: "user",
          isActive: true,
          profileImage: imageUrl,
        });
      } else {
        local.clerkUserId = userId;
        local.name = name;
        if (imageUrl) local.profileImage = imageUrl;
        await local.save();
      }

      // Admin assignment by email list
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (email && adminEmails.includes(email.toLowerCase())) {
        if (local.role !== "admin") {
          local.role = "admin";
          await local.save();
        }
      }
    }

    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }
});

export default router;
