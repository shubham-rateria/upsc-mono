import { Router } from "express";
import toppersRouter from "./routes/toppers";
import documentsRouter from "./routes/documents";
import userRouter from "./routes/user";
import referralRouter from "./routes/referral";
import usageRouter from "./routes/usage";

export default () => {
  const app = Router();
  toppersRouter(app);
  documentsRouter(app);
  userRouter(app);
  referralRouter(app);
  usageRouter(app);
  return app;
};
