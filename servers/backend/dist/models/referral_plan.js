"use strict";
/**
 * user model for db
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralPlanModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const ReferralPlanSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        default: (0, uuid_1.v4)(),
    },
    referred_by_user_id: {
        type: String,
        default: (0, uuid_1.v4)(),
    },
    referral_code_used: {
        type: String,
        required: true,
    },
    num_downloads: {
        type: Number,
        required: false,
        default: 2,
    },
    referral_code_used_on: {
        type: Number,
        required: true,
        default: Date.now(),
    },
});
exports.ReferralPlanModel = mongoose_1.default.model("ReferralPlan", ReferralPlanSchema, "referral_plan");
