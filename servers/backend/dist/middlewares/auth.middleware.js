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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const extractJwtMiddleware = (req, res, next) => {
    // Extract JWT from cookie
    const token = req.cookies.jwt;
    console.log({ token });
    if (!token) {
        return res.status(401).json({ message: "No JWT found in cookie" });
    }
    // Verify the JWT
    jsonwebtoken_1.default.verify(token, "your-secret-key", (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({ message: "Invalid JWT" });
        }
        try {
            // Find the user based on the JWT payload
            const user = yield user_1.UserModel.findById(decodedToken.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Attach the user object to the request
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }));
};
exports.default = extractJwtMiddleware;
