import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";
import { InitaliseIO } from "./utils/socket.io/io";

const app = express();
//config dotenv
dotenv.config();

app.use(helmet());
//middleware setup
app.use(
  cors({
    origin: [process.env.CLIENT ?? "", "http://localhost:3000"],
  })
);
app.use(express.json());
//ERROR HNADLING
app.use(((error, req, res, next) => {
  console.log("Error occured");
  res.json({ error: true, message: error.message });
}) as ErrorRequestHandler);
//route handling
import authRoutes from "./routes/auth";
import dataQueryRoutes from "./routes/dataQuery";
app.use("/auth", authRoutes);
app.use("/data", dataQueryRoutes);

//mongoose intialisation
mongoose
  .connect(process.env.MONGODB || "mongodb://127.0.0.1:27017/TeaTime")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((error) => console.log(error));

//listening
const server = app.listen(parseInt((process.env as { PORT: string })?.PORT, 10) || 4000);
InitaliseIO(server);
