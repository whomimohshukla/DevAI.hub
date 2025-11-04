"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const ai_1 = __importDefault(require("./routes/ai"));
const admin_providers_1 = __importDefault(require("./routes/admin.providers"));
const admin_providerModels_1 = __importDefault(
	require("./routes/admin.providerModels")
);
const admin_serviceRoutes_1 = __importDefault(
	require("./routes/admin.serviceRoutes")
);
const user_1 = __importDefault(require("./routes/user"));
const keys_1 = __importDefault(require("./routes/keys"));
const usage_1 = __importDefault(require("./routes/usage"));
dotenv_1.default.config({ debug: false });
const app = (0, express_1.default)();
const port = process.env.PORT || "3000";
app.use(express_1.default.json());
app.get("/", (req, res) => {
	res.send("Hello World!");
});
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
	const status = err.status || 500;
	res.status(status).json({ error: err.message || "Internal Server Error" });
});
async function start() {
	try {
		await (0, db_1.connectDB)();
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
}
start();
