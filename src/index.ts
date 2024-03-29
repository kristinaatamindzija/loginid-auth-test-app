import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
