"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(uri) {
    const mongoUri = uri || process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not set in environment variables");
    }
    mongoose_1.default.set("strictQuery", true);
    // Helpful connection event logs
    mongoose_1.default.connection.on("connected", () => {
        try {
            const masked = maskMongoUri(mongoUri);
            console.log(`[DB] Connected to ${masked}`);
        }
        catch {
            console.log("[DB] Connected to MongoDB");
        }
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.error("[DB] MongoDB connection error:", err);
    });
    mongoose_1.default.connection.on("disconnected", () => {
        console.warn("[DB] MongoDB disconnected");
    });
    // Attempt to connect
    try {
        await mongoose_1.default.connect(mongoUri);
        // Optional ping to ensure connectivity
        // Ping only if db handle is present (TS-safe optional chaining)
        await mongoose_1.default.connection.db?.admin().ping();
        return mongoose_1.default.connection;
    }
    catch (err) {
        console.error("[DB] Failed to connect to MongoDB:", err.message);
        throw err;
    }
}
function maskMongoUri(uri) {
    try {
        // Mask credentials in URI for logging
        const u = new URL(uri.replace("mongodb+srv://", "https://").replace("mongodb://", "http://"));
        if (u.password) {
            u.password = "****";
        }
        if (u.username) {
            u.username = "****";
        }
        const proto = uri.startsWith("mongodb+srv://") ? "mongodb+srv://" : "mongodb://";
        return proto + (u.username ? `${u.username}:${u.password}@` : "") + u.host + u.pathname;
    }
    catch {
        return "mongodb://<masked>";
    }
}
