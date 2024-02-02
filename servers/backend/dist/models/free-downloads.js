"use strict";
/**
 * user model for db
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreeDownloadModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const FreeDownloadSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        default: (0, uuid_1.v4)(),
    },
    downloads: {
        type: Number,
        default: 3,
    },
});
exports.FreeDownloadModel = mongoose_1.default.model("FreeDownload", FreeDownloadSchema, "free_download");
