"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageModel = exports.PageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Page schema
exports.PageSchema = new mongoose_1.default.Schema({
    page_number: {
        type: Number,
        required: true,
    },
    ocr: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: null,
    },
    keyword_tags: [
        {
            keyword: String,
            score: Number,
        },
    ],
});
exports.PageModel = mongoose_1.default.models.Page || mongoose_1.default.model("Page", exports.PageSchema, "page");
