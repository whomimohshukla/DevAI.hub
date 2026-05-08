"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const ai_1 = __importDefault(require("./routes/ai"));
const admin_providers_1 = __importDefault(require("./routes/admin.providers"));
const admin_providerModels_1 = __importDefault(require("./routes/admin.providerModels"));
const admin_serviceRoutes_1 = __importDefault(require("./routes/admin.serviceRoutes"));
const user_1 = __importDefault(require("./routes/user"));
const keys_1 = __importDefault(require("./routes/keys"));
const usage_1 = __importDefault(require("./routes/usage"));
dotenv_1.default.config({ debug: false });
const app = (0, express_1.default)();
const port = process.env.PORT || "4000";
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim());
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-api-key",
    ],
}));
app.use(express_1.default.json());
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use((0, morgan_1.default)(logFormat));
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/auth", auth_1.default);
app.use("/api/ai", ai_1.default);
app.use("/admin/providers", admin_providers_1.default);
app.use("/admin/provider-models", admin_providerModels_1.default);
app.use("/admin/service-routes", admin_serviceRoutes_1.default);
app.use("/user", user_1.default);
app.use("/keys", keys_1.default);
app.use("/usage", usage_1.default);
// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
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
    const message = status >= 500 ? "Internal Server Error" : err.message || "Request failed";
    return res.status(status).json({ error: message });
});
async function start() {
    try {
        await (0, db_1.connectDB)();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}
start();
