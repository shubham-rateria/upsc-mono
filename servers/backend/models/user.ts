/**
 * user model for db
 */

import mongoose from "mongoose";
import { v4 } from "uuid";

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: v4(),
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

export const UserModel = mongoose.model("User", UserSchema, "user");
