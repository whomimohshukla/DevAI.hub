import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import aiRouter from "./routes/ai";
import adminProvidersRouter from "./routes/admin.providers";
import adminProviderModelsRouter from "./routes/admin.providerModels";
import adminServiceRoutesRouter from "./routes/admin.serviceRoutes";
import userRouter from "./routes/user";
import keysRouter from "./routes/keys";
import usageRouter from "./routes/usage";

dotenv.config({ debug: false });

const app = express();
const port = process.env.PORT || "4000";

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-api-key",
    ],
  })
);

app.use(express.json());

const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRouter);
app.use("/api/ai", aiRouter);
app.use("/admin/providers", adminProvidersRouter);
app.use("/admin/provider-models", adminProviderModelsRouter);
app.use("/admin/service-routes", adminServiceRoutesRouter);
app.use("/user", userRouter);
app.use("/keys", keysRouter);
app.use("/usage", usageRouter);

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (
    err: {
      status?: number;
      message?: string;
      name?: string;
      code?: number;
      errors?: Record<string, { message?: string }>;
    },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    if (err.name === "ValidationError" && err.errors) {
      const details = Object.values(err.errors)
        .map((item) => item.message)
        .filter(Boolean);
      return res.status(400).json({
        error: details[0] || "Validation failed",
        details,
      });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid resource id" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: "Resource already exists" });
    }

    const status = err.status || 500;
    const message =
      status >= 500 ? "Internal Server Error" : err.message || "Request failed";
    return res.status(status).json({ error: message });
  }
);

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
