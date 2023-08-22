import { Router, Request, Response } from "express";
import { UserModel } from "../../../models/user";
import stytch from "stytch";

const route = Router();

const client = new stytch.Client({
  project_id: "project-test-1922a505-c16b-4984-b69a-a950470b4ae3",
  secret: "secret-test-F1XvCGiRjs2AhM02sBEo2ZtGMsIQtw9hPWk=",
});

const params = {
  user_id: "user-test-16d9ba61-97a1-4ba4-9720-b03761dc50c6",
};

export default (app: Router) => {
  app.use("/user", route);

  route.post("/login-otp-beta", async (req: Request, res: Response) => {
    const { phone } = req.body;

    // check if user exists
    const user = await UserModel.findOne({
      phone,
      beta_user: true,
    }).exec();

    if (user) {
    }
  });
};
