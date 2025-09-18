import express from "express";
import dotenv from "dotenv";


dotenv.config({ debug: false });

const app = express();
const port = process.env.PORT;

app.use(express.json());




app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});