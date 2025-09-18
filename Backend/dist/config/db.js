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
    await mongoose_1.default.connect(mongoUri);
    return mongoose_1.default.connection;
}
