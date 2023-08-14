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
const page_1 = require("../models/page");
const s3_1 = require("../services/s3");
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
function searchByKeyword(keyword, pageNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * if mongoose is disconnected, throw an error
         */
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error("Mongoose not connected.");
        }
        const resultsPerPage = 100;
        const skipCount = (pageNumber - 1) * resultsPerPage;
        let documentsResult = [];
        if (keyword) {
            console.log("searching for", keyword);
            const pages = yield page_1.PageModel.find({
                $text: { $search: keyword },
                // "ocr.labelAnnotations.description": "Handwriting",
            }, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(skipCount)
                .limit(resultsPerPage)
                .select({
                ocr: 0,
            })
                .lean();
            const documents = [];
            for (const page of pages) {
                const document = yield document_1.DocumentModel.findOne({
                    "pages._ref.$id": page._id,
                })
                    .select({ pages: 0 })
                    .lean();
                if (!document) {
                    continue;
                }
                documents.push(Object.assign(Object.assign({}, document), { _id: document._id.toString(), page }));
            }
            const groupedDocuments = (0, lodash_1.groupBy)(documents, (document) => document._id);
            /**
             * get unique documents and merge their page attributes
             */
            const keywordDocumentSearchPromises = Object.values(groupedDocuments).map((documents) => __awaiter(this, void 0, void 0, function* () {
                const document = documents[0];
                const pages = documents.map((document) => document.page);
                let score = 0;
                for (const page of pages) {
                    score += page.score;
                    /**
                     * find matching words from search query
                     */
                    const matchingWords = keyword
                        .toLowerCase()
                        .split(" ")
                        .filter((word) => {
                        var _a;
                        const regex = new RegExp(`\\b${word}\\b`, "i");
                        return regex.test((_a = page.clean_text) === null || _a === void 0 ? void 0 : _a.toLowerCase());
                    });
                    page.matching_words = matchingWords;
                    delete page.clean_text;
                    if (page.s3_img_object_name) {
                        const s3_signed_url = yield (0, s3_1.getSignedUrl)("page-img", page.s3_img_object_name, 5);
                        page.s3_signed_url = s3_signed_url;
                    }
                }
                return Object.assign(Object.assign({}, document), { pages, score });
            }));
            let keywordDocumentSearchDocuments = yield Promise.all(keywordDocumentSearchPromises);
            documentsResult.push(...keywordDocumentSearchDocuments);
            // @ts-ignore
            documentsResult.sort((a, b) => b.score - a.score);
            console.log("Keyword search documents", documentsResult.length);
        }
        return documentsResult;
    });
}
exports.default = searchByKeyword;
