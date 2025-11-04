import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db";

dotenv.config({ debug: false });

const app = express();
const port = process.env.PORT || "3000";

app.use(express.json());

// HTTP request logging
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.get("/", (req, res) => {
	res.send("Hello World!");
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
