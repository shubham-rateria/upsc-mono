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
const document_1 = require("../../../models/document");
const express_1 = require("express");
const s3_1 = require("../../../services/s3");
const search_by_keyword_1 = __importDefault(require("../../../utils/search-by-keyword"));
const search_by_subject_tags_1 = __importDefault(require("../../../utils/search-by-subject-tags"));
const search_by_topper_1 = __importDefault(require("../../../utils/search-by-topper"));
const fill_doc_with_pages_1 = __importDefault(require("../../../utils/fill-doc-with-pages"));
const mongoose_1 = __importDefault(require("mongoose"));
const page_1 = require("../../../models/page");
const ObjectId = mongoose_1.default.Types.ObjectId;
function getWordBlocksForPage(page) {
    const blocks = [];
    page.ocr.fullTextAnnotation.pages.forEach((page) => {
        page.blocks.forEach((block) => {
            block.paragraphs.forEach((paragraph) => {
                paragraph.words.forEach((word) => {
                    const wordText = word.symbols.map((s) => s.text).join("");
                    blocks.push({
                        text: wordText,
                        boundingBox: word.boundingBox,
                    });
                });
            });
        });
    });
    return blocks;
}
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/documents", route);
    route.get("/:documentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("getting doc id");
            const { documentId } = req.params;
            const document = yield document_1.DocumentModel.findById(documentId).lean().exec();
            if (!document) {
                res.status(500).json({ success: false });
                return;
            }
            const s3_signed_url = yield (0, s3_1.getSignedUrl)("upsc-files", 
            // @ts-ignore
            document.s3_object_name, 5);
            res
                .status(201)
                .json({ success: true, data: Object.assign(Object.assign({}, document), { s3_signed_url }) });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }));
    route.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const searchParams = req.body;
        let documentsResult = [];
        if (searchParams.keyword) {
            const keywordSearchDocResults = yield (0, search_by_keyword_1.default)(searchParams);
            documentsResult.push(...keywordSearchDocResults);
        }
        if (searchParams.subjectTags && searchParams.subjectTags.length > 0) {
            if (documentsResult.length > 0) {
                // documentsResult = documentsResult.filter((doc) => {
                //   for (const tag of searchParams.subjectTags || []) {
                //     return doc.l0_categories.includes(mapTagTypeToNumber[tag.type]);
                //   }
                // });
            }
            else {
                const tagSearchResults = yield (0, search_by_subject_tags_1.default)(searchParams);
                console.log("tagSearchResults", tagSearchResults.length);
                documentsResult = tagSearchResults;
            }
        }
        if (searchParams.topper) {
            if (documentsResult.length > 0) {
                // documentsResult = documentsResult.filter((doc) => {
                //   return (
                //     doc.topper?.name === searchParams.topper?.name &&
                //     doc.topper?.rank === searchParams.topper?.rank &&
                //     doc.topper?.year === searchParams.topper?.year
                //   );
                // });
            }
            else {
                const topperResults = yield (0, search_by_topper_1.default)(searchParams);
                documentsResult.push(...topperResults);
            }
        }
        /**
         * if document type is not null
         * get the documents that have the matching document type
         * and filter unique documents by that
         */
        // if (
        //   searchParams.documentType !== null &&
        //   searchParams.documentType !== undefined
        // ) {
        //   if (documentsResult.length > 0) {
        //     documentsResult = documentsResult.filter((document) => {
        //       if (
        //         document.document_type !== null &&
        //         document.document_type !== undefined
        //       ) {
        //         return document.document_type === searchParams.documentType;
        //       } else {
        //         console.log("no doc type", document._id);
        //       }
        //     });
        //   } else {
        //     const docTypeResults = await DocumentModel.find({
        //       document_type: searchParams.documentType,
        //     })
        //       .lean()
        //       .exec();
        //     for (const doc of docTypeResults) {
        //       // get the first 5 pages of this doc
        //     }
        //   }
        // }
        documentsResult = yield Promise.all(documentsResult.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
            const pages = yield (0, fill_doc_with_pages_1.default)(doc);
            if (pages) {
                return Object.assign(Object.assign({}, doc), { pages });
            }
            else {
                return doc;
            }
        })));
        res.status(200).json({ success: true, data: documentsResult });
    }));
    route.post("/:documentId/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("doc search");
            const { documentId } = req.params;
            const { searchTerm } = req.body;
            const document = yield document_1.DocumentModel.findById(documentId).lean();
            if (!document) {
                res.status(500).json({ success: false, data: "No Docs." });
                return;
            }
            // @ts-ignore
            const pageIds = document === null || document === void 0 ? void 0 : document.pages.map((page) => page._ref.oid.toString());
            const searchResultPromises = [];
            for (const pageId of pageIds) {
                const search = page_1.PageModel.find({
                    _id: new ObjectId(pageId),
                    $text: { $search: searchTerm },
                })
                    .lean()
                    .exec();
                searchResultPromises.push(search);
            }
            const results = (yield Promise.all(searchResultPromises))
                .map((r) => {
                if (r.length > 0) {
                    const blocks = getWordBlocksForPage(r[0]);
                    const searchBlocks = [];
                    const searchTerms = searchTerm.toLowerCase().split(" ");
                    for (const block of blocks) {
                        for (const term of searchTerms) {
                            if (block.text.toLowerCase() === term) {
                                searchBlocks.push(block);
                            }
                        }
                    }
                    return {
                        matching_blocks: searchBlocks,
                        page_number: r[0].page_number,
                        height: r[0].ocr.fullTextAnnotation.pages[0].height,
                        width: r[0].ocr.fullTextAnnotation.pages[0].width,
                    };
                }
            })
                .filter((r) => r);
            res.status(201).json({ success: true, data: { pages: results } });
        }
        catch (error) {
            console.error("error in doc search", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }));
};
