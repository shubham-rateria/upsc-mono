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
const page_1 = require("../models/page");
const s3_1 = require("../services/s3");
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@usn/common");
function searchByKeyword({ keyword, pageNumber = 1, documentType, subjectTags, topper, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * if mongoose is disconnected, throw an error
         */
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error("Mongoose not connected.");
        }
        /**
         * In search by keyword, we will paginate the final document output rather
         * than paginating the aggregation. This is because with mongodb search has to be
         * the first stage of the aggregation pipeline.
         *
         * We can safely assume a number of 5000 results, since that is about 5%
         * of our pages dataset and no result post that number in a sorted order should
         * be relevant anyway
         */
        const resultsPerPage = 2000;
        let documentsResult = [];
        const additionalDocumentQueries = { $match: {} };
        if (documentType !== null && documentType !== undefined) {
            additionalDocumentQueries["$match"]["document_type"] = documentType;
        }
        if (topper) {
            additionalDocumentQueries["$match"]["topper.name"] = topper.name;
            additionalDocumentQueries["$match"]["topper.rank"] = topper.rank;
            additionalDocumentQueries["$match"]["topper.year"] = topper.year;
        }
        if (subjectTags) {
            // find l0 subject tags
            const l0Tags = subjectTags.filter((tag) => tag.level === "l0");
            if (l0Tags.length > 0) {
                additionalDocumentQueries["$match"]["l0_categories"] = l0Tags.map((tag) => common_1.mapTagTypeToNumber[tag.type]);
            }
        }
        if (keyword) {
            console.log("searching for", keyword);
            const pipeline = [
                {
                    $search: {
                        index: "page_search",
                        text: {
                            query: keyword,
                            path: "clean_text",
                        },
                        highlight: {
                            path: "clean_text", // Replace with the same field you are searching in
                        },
                    },
                },
                {
                    $skip: 0, // Replace pageNumber and pageSize with your desired values
                },
                {
                    $limit: resultsPerPage, // Replace pageSize with your desired value
                },
                {
                    $project: {
                        documentId: 1,
                        page_number: 1,
                        s3_img_object_name: 1,
                        highlights: { $meta: "searchHighlights" },
                        score: {
                            $meta: "searchScore",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$documentId",
                        pages: {
                            $push: "$$ROOT",
                        },
                    },
                },
                {
                    $addFields: {
                        documentIdObjectId: { $toObjectId: "$_id" },
                    },
                },
                {
                    $lookup: {
                        from: "document",
                        // Replace with your target collection name
                        localField: "documentIdObjectId",
                        foreignField: "_id",
                        as: "targetDoc",
                    },
                },
                {
                    $unwind: "$targetDoc",
                },
                {
                    $project: {
                        documentId: "$_id",
                        pages: 1,
                        s3_object_name: "$targetDoc.s3_object_name",
                        topper: "$targetDoc.topper",
                        l0_categories: "$targetDoc.l0_categories",
                        num_pages: "$targetDoc.num_pages",
                        document_type: "$targetDoc.document_type",
                    },
                },
            ];
            if (Object.keys(additionalDocumentQueries.$match).length > 0) {
                pipeline.push(additionalDocumentQueries);
            }
            const pages = yield page_1.PageModel.aggregate(pipeline).exec();
            console.log("found docs", pages.length);
            for (const document of pages) {
                // @ts-ignore
                let pages = document.pages.sort((a, b) => b.score - a.score).slice(0, 6);
                pages.sort((a, b) => b.score - a.score);
                let score = 0;
                for (const page of pages) {
                    score += page.score;
                    page.matching_words = [];
                    /**
                     * find matching words from search query
                     */
                    // const matchingWords = keyword
                    //   .toLowerCase()
                    //   .split(" ")
                    //   .filter((word: string) => {
                    //     const regex = new RegExp(`\\b${word}\\b`, "i");
                    //     return regex.test(page.clean_text?.toLowerCase());
                    //   });
                    // page.matching_words = matchingWords;
                    // delete page.clean_text;
                    page.highlights.forEach((highlight) => {
                        highlight.texts.forEach((text) => {
                            if (text.type === "hit") {
                                page.matching_words.push(text.value.toLowerCase());
                            }
                        });
                    });
                    page.matching_words = Array.from(new Set(page.matching_words));
                    delete page.highlights;
                    if (page.s3_img_object_name) {
                        const s3_signed_url = yield (0, s3_1.getSignedUrl)("page-img", page.s3_img_object_name, 5);
                        page.s3_signed_url = s3_signed_url;
                    }
                }
                // @ts-ignore
                document.score = score;
                document.pages = pages;
            }
            documentsResult = pages;
            // @ts-ignore
            documentsResult.sort((a, b) => b.score - a.score);
            console.log("Keyword search documents", documentsResult.length);
        }
        const limit = 30;
        const skipCount = (pageNumber - 1) * limit;
        return documentsResult.slice(skipCount, skipCount + limit);
    });
}
exports.default = searchByKeyword;
