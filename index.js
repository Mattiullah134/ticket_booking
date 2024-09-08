import express from "express";
import userAuthRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
console.log(new Date().getTime() / 60000);

app.listen(port, () => {
  console.log(`app is listening on the port ${port}`);
});
app.use("/api/auth", userAuthRouter);
