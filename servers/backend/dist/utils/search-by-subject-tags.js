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
exports.mapTagTypeToNumber = exports.mapTagTypeToCategories = void 0;
const gs1_categories_1 = __importDefault(require("../data/gs1-categories"));
const gs2_categories_1 = __importDefault(require("../data/gs2-categories"));
const gs3_categories_1 = __importDefault(require("../data/gs3-categories"));
const gs4_categories_1 = __importDefault(require("../data/gs4-categories"));
const optionals_categories_1 = __importDefault(require("../data/optionals-categories"));
const flatten_object_1 = __importDefault(require("./flatten-object"));
const page_1 = require("../models/page");
const document_1 = require("../models/document");
const lodash_1 = require("lodash");
const s3_1 = require("../services/s3");
const mongoose_1 = __importDefault(require("mongoose"));
exports.mapTagTypeToCategories = {
    GS1: gs1_categories_1.default,
    GS2: gs2_categories_1.default,
    GS3: gs3_categories_1.default,
    GS4: gs4_categories_1.default,
    Optionals: optionals_categories_1.default,
};
exports.mapTagTypeToNumber = {
    GS1: 1,
    GS2: 2,
    GS3: 3,
    GS4: 4,
    Essay: 5,
};
function findDocumentsForKeywords(keywords, tagType) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = [];
        pages = yield page_1.PageModel.find({
            "keyword_tags.keyword": { $in: keywords },
        })
            .select({
            ocr: 0,
            clean_text: 0,
            category_tags: 0,
            category_tags_1: 0,
        })
            .skip(0)
            .limit(1000)
            .sort({})
            .lean();
        console.log("Found pages", pages.length);
        for (const page of pages) {
            let pageScore = 0;
            try {
                for (const k of page.keyword_tags) {
                    if (keywords.includes(k.keyword)) {
                        // console.log("matching keyword", k);
                        pageScore += k.score;
                    }
                }
            }
            catch (error) {
                console.error("error score", page);
            }
            page.score = pageScore;
        }
        const documents = [];
        for (const page of pages) {
            const document = yield document_1.DocumentModel.findOne({
                "pages._ref.$id": page._id,
                l0_categories: exports.mapTagTypeToNumber[tagType],
            })
                .select({
                pages: 0,
                category_tags: 0,
                keyword_tags: 0,
                category_tags_1: 0,
                keyword_tags_1: 0,
                percentage_keywords: 0,
                median_keywords: 0,
            })
                .lean();
            if (!document) {
                continue;
            }
            documents.push(Object.assign(Object.assign({}, document), { _id: document._id.toString(), page }));
        }
        console.log("Found documents", documents.length);
        const groupedDocuments = (0, lodash_1.groupBy)(documents, (document) => document._id);
        /**
         * get unique documents and merge their page attributes
         */
        const uniqueDocumentsPromise = Object.values(groupedDocuments).map((documents) => __awaiter(this, void 0, void 0, function* () {
            const document = documents[0];
            let pages = documents.map((document) => document.page);
            let scoreSum = 0;
            for (const page of pages) {
                if (page.s3_img_object_name) {
                    const s3_signed_url = yield (0, s3_1.getSignedUrl)("page-img", page.s3_img_object_name, 5);
                    page.s3_signed_url = s3_signed_url;
                }
                scoreSum += page.score;
            }
            delete document.page;
            pages = pages.sort((a, b) => b.score - a.score);
            return Object.assign(Object.assign({}, document), { pages, score: scoreSum });
        }));
        let uniqueDocuments = yield Promise.all(uniqueDocumentsPromise);
        // sort unique documents by score
        uniqueDocuments.sort((a, b) => b.score - a.score);
        console.log("Unique Documents", uniqueDocuments.length);
        return uniqueDocuments;
    });
}
function findDocumentsForTag(tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryFilter = exports.mapTagTypeToCategories[tag.type];
        let keywords = [];
        let results = [];
        if (tag.level === "l0") {
            // if (tag.type === "Essay") {
            //   const essayResults = await DocumentModel.find({ l0_categories: 5 })
            //     .select({ pages: 0 })
            //     .lean()
            //     .exec();
            //   // @ts-ignore
            //   results.push(...essayResults);
            // }
            const l0Results = yield document_1.DocumentModel.find({
                l0_categories: exports.mapTagTypeToNumber[tag.type],
            })
                .select({ pages: 0 })
                .lean();
            // @ts-ignore
            results.push(...l0Results);
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
        const bowResults = yield findDocumentsForKeywords(keywords, tag.type);
        console.log("bowResults", bowResults.length);
        results.push(...bowResults);
        return results;
    });
}
function searchBySubjectTags(tags) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * if mongoose is disconnected, throw an error
         */
        if (mongoose_1.default.connection.readyState !== 1) {
            throw new Error("Mongoose not connected.");
        }
        let documentResults = [];
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                const documentResult = yield findDocumentsForTag(tag);
                documentResults.push(...documentResult);
            }
        }
        return documentResults;
    });
}
exports.default = searchBySubjectTags;
