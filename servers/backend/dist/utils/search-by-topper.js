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
const limit = 50;
function searchByTopper({ topper, pageNumber, documentType, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * if mongoose is disconnected, throw an error
         */
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error("Mongoose not connected.");
        }
        let documentsResult = [];
        if (topper) {
            const query = {
                topper: {
                    name: topper.name,
                    rank: topper.rank,
                    year: topper.year,
                },
            };
            if (documentType !== null && documentType !== undefined) {
                query["document_type"] = documentType;
            }
            // @ts-ignore
            documentsResult = yield document_1.DocumentModel.find(query)
                .select({
                keyword_tags: 0,
                keyword_tags_1: 0,
                percentage_keywords: 0,
                pages: 0,
            })
                .skip(((pageNumber || 1) - 1) * limit)
                .limit(limit)
                .lean();
            console.log(`Found ${documentsResult.length} for topper`);
        }
        return documentsResult;
    });
}
exports.default = searchByTopper;
