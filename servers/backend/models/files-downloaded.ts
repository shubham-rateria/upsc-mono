/**
 * user model for db
 */

import mongoose from "mongoose";
import { v4 } from "uuid";

const FileDownloaded = new mongoose.Schema({
  userId: {
    type: String,
    default: v4(),
  },

  fileS3ObjectName: {
    type: String,
    required: true,
  },

  downloaded_through_plan: {
    type: Number,
    required: true,
  },

  downloaded_on: {
    // timestamp
    type: Number,
    required: true,
  },
});

export const FileDownloadedModel = mongoose.model(
  "FileDownloaded",
  FileDownloaded,
  "file_downloaded"
);
