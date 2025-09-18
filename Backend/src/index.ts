import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db";
import aiRouter from "./routes/ai";
import adminProvidersRouter from "./routes/admin.providers";
import adminProviderModelsRouter from "./routes/admin.providerModels";
import adminServiceRoutesRouter from "./routes/admin.serviceRoutes";
import userRouter from "./routes/user";
import keysRouter from "./routes/keys";
import usageRouter from "./routes/usage";
import billingRouter from "./routes/billing";
import webhooksRouter from "./routes/webhooks";

dotenv.config({ debug: false });

const app = express();
const port = process.env.PORT || "3000";

// Stripe webhooks require raw body for signature verification
app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
// JSON parser for the rest of the app
app.use(express.json());

// HTTP request logging
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/ai", aiRouter);
app.use("/admin/providers", adminProvidersRouter);
app.use("/admin/provider-models", adminProviderModelsRouter);
app.use("/admin/service-routes", adminServiceRoutesRouter);
app.use("/user", userRouter);
app.use("/keys", keysRouter);
app.use("/usage", usageRouter);
app.use("/billing", billingRouter);
app.use("/webhooks", webhooksRouter);

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();