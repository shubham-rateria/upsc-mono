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
const document_1 = require("../models/document");
const mongoose_1 = __importDefault(require("mongoose"));
function searchByTopper(topper) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * if mongoose is disconnected, throw an error
         */
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error("Mongoose not connected.");
        }
        let documentsResult = [];
        if (topper) {
            console.log("searching for", topper);
            // @ts-ignore
            documentsResult = yield document_1.DocumentModel.find({
                topper: {
                    name: topper.name,
                    rank: topper.rank,
                    year: topper.year,
                },
            })
                .select({
                keyword_tags: 0,
                keyword_tags_1: 0,
                percentage_keywords: 0,
                pages: 0,
            })
                .lean();
            console.log(`Found ${documentsResult.length} for topper`);
        }
        return documentsResult;
    });
}
exports.default = searchByTopper;
