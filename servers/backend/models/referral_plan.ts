/**
 * user model for db
 */

import mongoose from "mongoose";
import { v4 } from "uuid";

const ReferralPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: v4(),
  },

  referred_by_user_id: {
    type: String,
    default: v4(),
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

export const ReferralPlanModel = mongoose.model(
  "ReferralPlan",
  ReferralPlanSchema,
  "referral_plan"
);
