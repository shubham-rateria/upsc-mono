/**
 * user model for db
 */

import mongoose from "mongoose";
import { v4 } from "uuid";

// @ts-ignore
// import dbref from "mongoose-dbref";

// dbref.install(mongoose);

const UserSchema = new mongoose.Schema({
  // userId: {
  //   type: String,
  //   default: v4(),
  // },

  email: {
    type: String,
    default: null,
    required: false,
  },

  /**
   * devices that the user has logged in from
   * a device contains device name, last logged in time, and device id
   */
  // devices: [
  //   {
  //     device_name: {
  //       type: String,
  //       required: true,
  //     },
  //     last_logged_in: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //     device_id: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],

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
