import { Router } from "express";
import toppersRouter from "./routes/toppers";
import documentsRouter from "./routes/documents";
import userRouter from "./routes/user";

export default () => {
  const app = Router();
  toppersRouter(app);
  documentsRouter(app);
  userRouter(app);
  return app;
};
