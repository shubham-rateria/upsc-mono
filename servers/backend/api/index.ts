import { Router } from "express";
import toppersRouter from "./routes/toppers";
import documentsRouter from "./routes/documents";

export default () => {
  const app = Router();
  toppersRouter(app);
  documentsRouter(app);
  return app;
};
