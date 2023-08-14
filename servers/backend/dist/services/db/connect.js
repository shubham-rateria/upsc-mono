"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const mongoose_dbref_1 = __importDefault(require("mongoose-dbref"));
const MONGODB_URI = process.env.NODE_ENV === "production"
    ? process.env.DB_URL_PROD
    : process.env.DB_URL_LOCAL;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!MONGODB_URI) {
        throw new Error("Mongo uri unspecified.");
    }
    try {
        if (((_a = mongoose_1.default.connections[0]) === null || _a === void 0 ? void 0 : _a.readyState) !== 1) {
            yield mongoose_1.default.connect(MONGODB_URI, {
                dbName: "upsc_scraper",
            });
            mongoose_dbref_1.default.install(mongoose_1.default);
            console.log("Connected to MongoDB");
        }
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
});
exports.default = connectToDatabase;
