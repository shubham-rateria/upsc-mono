import { Router, Request, Response } from "express";
import { UserModel } from "../../../models/user";
import jwt from "jsonwebtoken";
import authMiddleware from "../../../middlewares/auth.middleware";
import axios from "axios";

const stytch = require("stytch");

const route = Router();

const axiosInstance = axios.create({
  baseURL: "https://test.stytch.com/v1/otps",
  headers: {
    Authorization:
      "Basic " +
      btoa(
        "project-test-1922a505-c16b-4984-b69a-a950470b4ae3" +
          ":" +
          "secret-test-F1XvCGiRjs2AhM02sBEo2ZtGMsIQtw9hPWk="
      ),
  },
});

export default (app: Router) => {
  app.use("/user", route);

  route.get("/me", authMiddleware, async (req: any, res) => {
    res.json({ user: req.user });
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

    // check if the user exists
    const userInDb = await UserModel.findOne({ phone }).exec();

    if (!userInDb) {
      const newUser = new UserModel({
        phone,
        onboarding: { onboarded: false },
      });
      await newUser.save();
    }
    res.status(200).json({ success: true });
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

  // Login handler
  route.post("/login", async (req, res) => {
    const { email } = req.body;

    // Authenticate user (this is a simplified example)
    const user = await UserModel.findOne({ email, beta_user: true });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const params = { email };

    const sres = await axiosInstance.post("/email/login_or_create", params);

    res.json({
      success: true,
      data: {
        email_id: sres.data.email_id,
      },
    });
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

    // Authenticate user (this is a simplified example)
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
