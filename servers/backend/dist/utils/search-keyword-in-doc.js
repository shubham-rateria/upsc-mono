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
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("../models/page");
function getWordBlocksForPage(docPage) {
    const blocks = [];
    docPage.ocrPages.forEach((page) => {
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
exports.default = (keyword, documentId) => __awaiter(void 0, void 0, void 0, function* () {
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
            $project: {
                _id: 1,
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
            $match: {
                documentId,
            },
        },
        {
            $lookup: {
                from: "page",
                localField: "_id",
                foreignField: "_id",
                as: "targetPage",
            },
        },
        {
            $addFields: {
                ocrPages: {
                    $arrayElemAt: ["$targetPage.ocr.fullTextAnnotation.pages", 0],
                },
            },
        },
        {
            $project: {
                documentId: 1,
                pages: 1,
                // s3_object_name: "$targetDoc.s3_object_name",
                // topper: "$targetDoc.topper",
                // l0_categories: "$targetDoc.l0_categories",
                // num_pages: "$targetDoc.num_pages",
                // document_type: "$targetDoc.document_type",
                // highlights: { $meta: "searchHighlights" },
                page_number: 1,
                ocrPages: 1,
            },
        },
    ];
    const pages = yield page_1.PageModel.aggregate(pipeline).exec();
    const results = [];
    if (pages.length > 0) {
        for (const page of pages) {
            const blocks = getWordBlocksForPage(page);
            const searchBlocks = [];
            const searchTerms = keyword.toLowerCase().split(" ");
            for (const block of blocks) {
                for (const term of searchTerms) {
                    if (block.text.toLowerCase() === term) {
                        searchBlocks.push(block);
                    }
                }
            }
            const result = {
                matching_blocks: searchBlocks,
                page_number: page.page_number,
                height: page.ocrPages[0].height,
                width: page.ocrPages[0].width,
            };
            results.push(result);
        }
    }
    return results;
});
