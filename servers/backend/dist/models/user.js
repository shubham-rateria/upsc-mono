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
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        default: (0, uuid_1.v4)(),
    },
    email: {
        type: String,
        default: null,
        required: false,
    },
    onboarding: {
        onboarded: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    name: {
        type: String,
        required: false,
    },
    /**
     * Phone to always be prepended by the country code
     */
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: false,
    },
    beta_user: {
        type: Boolean,
        required: false,
        default: false,
    },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema, "user");
