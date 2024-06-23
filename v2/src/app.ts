import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v2", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
