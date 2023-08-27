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
const flatten_object_1 = __importDefault(require("./flatten-object"));
const page_1 = require("../models/page");
const document_1 = require("../models/document");
const mongoose_1 = __importDefault(require("mongoose"));
const usn_common_1 = require("usn-common");
const s3_1 = require("../services/s3");
const RESULTS_PER_PAGE = 50;
function findDocumentsForKeywordsSearch(keywords, l0Category, pageNumber, documentType, topper) {
    return __awaiter(this, void 0, void 0, function* () {
        const skip = (pageNumber - 1) * RESULTS_PER_PAGE;
        const limit = RESULTS_PER_PAGE;
        const pipeline = [
            {
                $search: {
                    index: "page_search",
                    compound: {
                        should: keywords.map((keyword) => ({
                            text: {
                                query: keyword,
                                path: "clean_text",
                            },
                        })),
                    },
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: 1,
                    documentId: 1,
                    s3_img_object_name: 1,
                    page_number: 1,
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
        const additionalQueries = {
            $match: {
                l0_categories: l0Category,
            },
        };
        if (documentType !== null && documentType !== undefined) {
            additionalQueries["$match"]["document_type"] = documentType;
        }
        if (topper) {
            additionalQueries["$match"]["topper.name"] = topper.name;
            additionalQueries["$match"]["topper.rank"] = topper.rank;
            additionalQueries["$match"]["topper.year"] = topper.year;
        }
        console.log({ additionalQueries, documentType });
        pipeline.push(additionalQueries);
        const documentCandidates = yield page_1.PageModel.aggregate(pipeline).exec();
        let documents = [];
        // sort the documents
        for (const document of documentCandidates) {
            let scoreSum = 0;
            for (const page of document.pages) {
                scoreSum += page.score;
                if (page.s3_img_object_name) {
                    const s3_signed_url = yield (0, s3_1.getSignedUrl)("page-img", page.s3_img_object_name, 5);
                    page.s3_signed_url = s3_signed_url;
                }
            }
            const pages = document.pages.sort((a, b) => b.score - a.score);
            documents.push(Object.assign(Object.assign({}, document), { pages, score: scoreSum }));
        }
        // @ts-ignore
        documents = documents.sort((a, b) => b.score - a.score);
        return documents;
    });
}
function findDocumentsForKeywords(keywords, l0Category, pageNumber, documentType) {
    return __awaiter(this, void 0, void 0, function* () {
        const limit = 5000;
        let pages = [];
        const pipeline = [
            {
                $match: {
                    "keyword_tags.keyword": { $in: keywords },
                },
            },
            {
                $skip: 0,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: 1,
                    keyword_tags: 1,
                    documentId: 1,
                    s3_img_object_name: 1,
                    page_number: 1,
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
        const additionalQueries = {
            $match: {
                l0_categories: l0Category,
            },
        };
        if (documentType) {
            additionalQueries["$match"]["document_type"] = documentType;
        }
        pipeline.push(additionalQueries);
        const documentCandidates = yield page_1.PageModel.aggregate(pipeline).exec();
        let documents = [];
        // sort the documents
        for (const document of documentCandidates) {
            let scoreSum = 0;
            for (const page of document.pages) {
                let pageScore = 0;
                // keywords can be present multiple times,
                // this prevents them from being added again to the score
                const checkedKeywords = [];
                try {
                    for (const k of page.keyword_tags) {
                        if (keywords.includes(k.keyword) &&
                            !checkedKeywords.includes(k.keyword)) {
                            pageScore += k.score;
                            checkedKeywords.push(k.keyword);
                        }
                    }
                }
                catch (error) {
                    console.error("error score", page);
                }
                scoreSum += pageScore;
                page.score = pageScore;
                delete page.keyword_tags;
                if (page.s3_img_object_name) {
                    const s3_signed_url = yield (0, s3_1.getSignedUrl)("page-img", page.s3_img_object_name, 5);
                    page.s3_signed_url = s3_signed_url;
                }
            }
            const pages = document.pages.sort((a, b) => b.score - a.score);
            documents.push(Object.assign(Object.assign({}, document), { pages, score: scoreSum }));
        }
        // @ts-ignore
        documents = documents.sort((a, b) => b.score - a.score);
        return documents.slice(0, 10);
        // return documents;
    });
}
function searchBySubjectTags({ subjectTags, pageNumber = 1, documentType, topper, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * if mongoose is disconnected, throw an error
         */
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error("Mongoose not connected.");
        }
        let documentResults = [];
        if (subjectTags && subjectTags.length > 0) {
            for (const tag of subjectTags) {
                const categoryFilter = usn_common_1.mapTagTypeToCategories[tag.type];
                let keywords = [];
                let results = [];
                const limit = 10;
                if (tag.level === "l0") {
                    const documentL0Query = {};
                    if (documentType !== null && documentType !== undefined) {
                        documentL0Query["document_type"] = documentType;
                    }
                    if (tag.optionalsId) {
                        documentL0Query["l0_categories"] = tag.optionalsId;
                    }
                    else {
                        documentL0Query["l0_categories"] = usn_common_1.mapTagTypeToNumber[tag.type];
                    }
                    const l0Results = yield document_1.DocumentModel.find(documentL0Query)
                        .select({ pages: 0 })
                        .skip((pageNumber - 1) * limit)
                        .limit(limit)
                        .sort({ num_pages: -1 })
                        .lean();
                    // @ts-ignore
                    results.push(...l0Results);
                    return results;
                }
                let l0Category = -1;
                if (tag.optionalsId) {
                    l0Category = tag.optionalsId;
                }
                else {
                    l0Category = usn_common_1.mapTagTypeToNumber[tag.type];
                }
                if (tag.level === "l1") {
                    // find key in cateogryFilter.cateogries
                    let categoryObject = {};
                    for (const category of categoryFilter.categories) {
                        Object.keys(category).forEach((key) => {
                            if (key === tag.value.tagText) {
                                categoryObject = category;
                            }
                        });
                    }
                    // flatten the category object
                    keywords = (0, flatten_object_1.default)(categoryObject);
                    keywords.push(tag.value.tagText);
                }
                if (tag.level === "l2") {
                    let categoryObject = {};
                    for (const category of categoryFilter.categories) {
                        Object.keys(category).forEach((key) => {
                            // @ts-ignore
                            Object.keys(category[key]).forEach((subKey) => {
                                if (subKey === tag.value.tagText) {
                                    // @ts-ignore
                                    categoryObject = category[key][subKey];
                                }
                            });
                        });
                    }
                    // flatten the category object
                    keywords = (0, flatten_object_1.default)(categoryObject);
                    keywords.push(tag.value.tagText);
                }
                console.log("Finding keywords", keywords);
                const keywordResults = yield findDocumentsForKeywordsSearch(keywords, l0Category, pageNumber, documentType, topper);
                console.log("keywordResults", keywordResults.length);
                documentResults.push(...keywordResults);
            }
        }
        return documentResults;
    });
}
exports.default = searchBySubjectTags;
