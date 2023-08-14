"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const mongoose_dbref_1 = __importDefault(require("mongoose-dbref"));
mongoose_dbref_1.default.install(mongoose_1.default);
// @ts-ignore
const DBRef = mongoose_1.default.SchemaTypes.DBRef;
// Define the Document schema
const DocumentSchema = new mongoose_1.default.Schema({
    s3_object_name: {
        type: String,
        required: true,
    },
    pages: [
        {
            _ref: {
                type: DBRef,
                resolve: true,
                ref: "Page",
            },
            _cls: {
                type: String,
                default: "Page", // Make sure this matches the name of your PageSchema
            },
        },
    ],
    num_pages: {
        type: Number,
        default: null,
    },
    document_type: {
        type: Number,
        default: null,
        required: false,
    },
    topper: {
        name: {
            type: String,
            default: null,
            required: false,
        },
        rank: {
            type: String,
            default: null,
            required: false,
        },
        year: {
            type: String,
            default: null,
            required: false,
        },
    },
});
exports.DocumentModel = mongoose_1.default.models["Document"] ||
    mongoose_1.default.model("Document", DocumentSchema, "document");
