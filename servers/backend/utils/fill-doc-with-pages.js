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
const document_1 = require("../models/document");
const page_1 = require("../models/page");
const s3_1 = require("../services/s3");
/**
 * This function takes a document and if:
 * 1. Pages does not exist
 * 2. Pages length === 0,
 * fills the document with the first 5 pages of the document
 */
// @ts-ignore
function fillDocWithPages(doc) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const docPages = [];
        if (!doc.pages || doc.pages.length === 0) {
            const document = yield document_1.DocumentModel.findById(doc._id).lean().exec();
            // @ts-ignore
            const pages = (_a = document === null || document === void 0 ? void 0 : document.pages) === null || _a === void 0 ? void 0 : _a.slice(0, 5);
            if (pages) {
                for (const page of pages) {
                    const pageId = page._ref.oid.toString();
                    const pageData = yield page_1.PageModel.findById(pageId)
                        .select({
                        ocr: 0,
                        category_tags: 0,
                        keyword_tags: 0,
                        keyword_tags_1: 0,
                        clean_text: 0,
                    })
                        .lean();
                    // @ts-ignore
                    if (pageData.s3_img_object_name) {
                        const s3_signed_url = yield (0, s3_1.getSignedUrl)("page-img", 
                        // @ts-ignore
                        pageData.s3_img_object_name, 5);
                        // @ts-ignore
                        pageData.s3_signed_url = s3_signed_url;
                    }
                    docPages.push(pageData);
                }
            }
            return docPages;
        }
        return null;
    });
}
exports.default = fillDocWithPages;
