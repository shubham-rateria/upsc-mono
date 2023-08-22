import { Router, Request, Response } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/user", route);

  route.post("/login-otp", async (req: Request, res: Response) => {});
};
