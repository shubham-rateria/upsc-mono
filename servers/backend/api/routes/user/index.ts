import { Router, Request, Response } from "express";
import { UserModel } from "../../../models/user";
import jwt from "jsonwebtoken";
import { FreeDownloadModel } from "../../../models/free-downloads";
import generateReferralId from "../../../utils/generate-referral-id";
import { v4 } from "uuid";

const route = Router();

export default (app: Router) => {
  app.use("/user", route);

  route.post("/me", async (req: Request, res: Response) => {
    const { phone } = req.body;
    let user: any | null = null;

    // check if the user exists
    user = await UserModel.findOne({ phone }).exec();

    if (!user) {
      res.status(500).send({ success: false, message: "User not found" }).end();
      return;
    }
    // Create a JWT and set it in a cookie
    const token = jwt.sign({ userId: user.userId }, "secret", {
      expiresIn: "24h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
    });
    res.status(200).json({ success: true, user });
  });

  route.post("/allow-beta-user", async (req, res) => {
    const { phone } = req.body;

    const user = await UserModel.findOne({ phone, beta_user: true });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true });
  });

  route.post("/login-or-create", async (req, res) => {
    const { phone } = req.body;
    let user: any | null = null;

    // check if the user exists
    user = await UserModel.findOne({ phone }).exec();

    if (!user) {
      user = new UserModel({
        phone,
        onboarding: { onboarded: false },
        referral_code: generateReferralId(),
        userId: v4(),
      });
      const freePlan = new FreeDownloadModel({
        userId: user.userId,
      });
      await user.save();
      await freePlan.save();
    }
    // Create a JWT and set it in a cookie
    const token = jwt.sign({ userId: user.userId }, "secret", {
      expiresIn: "24h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
    });
    res.status(200).json({ success: true, user });
  });

  route.post("/check-user-onboarded", async (req, res) => {
    const { phone } = req.body;
    const user = await UserModel.findOne({ phone }).exec();
    res.json({ onboarded: user?.onboarding?.onboarded ?? false });
  });

  route.post("/set-user-onboarded", async (req, res) => {
    const { phone } = req.body;
    const user = await UserModel.findOne({ phone }).exec();
    if (!user) {
      res.status(401).end();
      return;
    }
    user.onboarding = { onboarded: true };
    await user.save();
    res.json({ success: true });
  });

  route.post("/create-beta-user", async (req, res) => {
    let { phone } = req.body;

    if (!phone.startsWith("+91")) {
      phone = "+91" + phone;
    }

    console.log({ phone });

    const existingUser = await UserModel.findOne({ phone }).exec();

    if (existingUser) {
      res.status(200).json({ success: false, message: "User Exists" });
      return;
    }

    const user = new UserModel({ phone, beta_user: true });

    await user.save();

    res.status(200).json({ success: true });
  });

  route.post("/submit-otp", async (req, res) => {
    const { phone } = req.body;

    const user = await UserModel.findOne({ phone, beta_user: true });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT and set it in a cookie
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "24h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
    });
    res.json({ message: "Login successful" });
  });

  // Logout handler
  route.post("/logout", (req, res) => {
    // Clear the JWT cookie
    res.clearCookie("jwt");
    res.json({ message: "Logout successful" });
  });
};
