"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const free_downloads_1 = require("../../../models/free-downloads");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/user", route);
    route.post("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        let user = null;
        // check if the user exists
        user = yield user_1.UserModel.findOne({ phone }).exec();
        if (!user) {
            res.status(500).send({ success: false, message: "User not found" }).end();
            return;
        }
        // Create a JWT and set it in a cookie
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, "secret", {
            expiresIn: "24h",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
        });
        res.status(200).json({ success: true, user });
    }));
    route.post("/allow-beta-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        const user = yield user_1.UserModel.findOne({ phone, beta_user: true });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        res.status(200).json({ success: true });
    }));
    route.post("/login-or-create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        let user = null;
        // check if the user exists
        user = yield user_1.UserModel.findOne({ phone }).exec();
        if (!user) {
            user = new user_1.UserModel({
                phone,
                onboarding: { onboarded: false },
            });
            const freePlan = new free_downloads_1.FreeDownloadModel({
                userId: user.userId,
            });
            yield user.save();
            yield freePlan.save();
        }
        // Create a JWT and set it in a cookie
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, "secret", {
            expiresIn: "24h",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
        });
        res.status(200).json({ success: true, user });
    }));
    route.post("/check-user-onboarded", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { phone } = req.body;
        const user = yield user_1.UserModel.findOne({ phone }).exec();
        res.json({ onboarded: (_b = (_a = user === null || user === void 0 ? void 0 : user.onboarding) === null || _a === void 0 ? void 0 : _a.onboarded) !== null && _b !== void 0 ? _b : false });
    }));
    route.post("/set-user-onboarded", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        const user = yield user_1.UserModel.findOne({ phone }).exec();
        if (!user) {
            res.status(401).end();
            return;
        }
        user.onboarding = { onboarded: true };
        yield user.save();
        res.json({ success: true });
    }));
    route.post("/create-beta-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { phone } = req.body;
        if (!phone.startsWith("+91")) {
            phone = "+91" + phone;
        }
        console.log({ phone });
        const existingUser = yield user_1.UserModel.findOne({ phone }).exec();
        if (existingUser) {
            res.status(200).json({ success: false, message: "User Exists" });
            return;
        }
        const user = new user_1.UserModel({ phone, beta_user: true });
        yield user.save();
        res.status(200).json({ success: true });
    }));
    route.post("/submit-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        const user = yield user_1.UserModel.findOne({ phone, beta_user: true });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Create a JWT and set it in a cookie
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, "your-secret-key", {
            expiresIn: "24h",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
        });
        res.json({ message: "Login successful" });
    }));
    // Logout handler
    route.post("/logout", (req, res) => {
        // Clear the JWT cookie
        res.clearCookie("jwt");
        res.json({ message: "Logout successful" });
    });
};
