"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = sha256;
exports.generateApiKey = generateApiKey;
exports.getApiKeyId = getApiKeyId;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = __importDefault(require("crypto"));
function sha256(input) {
    return crypto_1.default.createHash("sha256").update(input).digest("hex");
}
function generateApiKey() {
    return `dak_${crypto_1.default.randomBytes(24).toString("hex")}`;
}
function getApiKeyId(apiKey) {
    return apiKey.slice(0, 16);
}
function hashPassword(password) {
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    const hash = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash)
        return false;
    const derived = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    try {
        return crypto_1.default.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
    }
    catch {
        return false;
    }
}
