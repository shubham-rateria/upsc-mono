"use strict";
/**
 * user model for db
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        default: null,
        required: false,
    },
    /**
     * devices that the user has logged in from
     * a device contains device name, last logged in time, and device id
     */
    devices: [
        {
            device_name: {
                type: String,
                required: true,
            },
            last_logged_in: {
                type: Date,
                default: Date.now,
            },
            device_id: {
                type: String,
                required: true,
            },
        },
    ],
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema, "user");
