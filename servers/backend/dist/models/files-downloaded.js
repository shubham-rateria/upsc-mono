"use strict";
/**
 * user model for db
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDownloadedModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const FileDownloaded = new mongoose_1.default.Schema({
    userId: {
        type: String,
        default: (0, uuid_1.v4)(),
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
exports.FileDownloadedModel = mongoose_1.default.model("FileDownloaded", FileDownloaded, "file_downloaded");
