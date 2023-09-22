/**
 * user model for db
 */

import mongoose from "mongoose";
import { v4 } from "uuid";

const FreeDownloadSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: v4(),
  },

  downloads: {
    type: Number,
    default: 10,
  },
});

export const FreeDownloadModel = mongoose.model(
  "FreeDownload",
  FreeDownloadSchema,
  "free_download"
);
