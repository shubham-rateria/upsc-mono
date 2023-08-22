"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usn_common_1 = require("usn-common");
const flatten_object_1 = __importDefault(require("./flatten-object"));
function findKeywordsForTag(tag) {
    console.log("find keywords for tag", tag);
    const categoryFilter = usn_common_1.mapTagTypeToCategories[tag.type];
    let keywords = [];
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
    return keywords;
}
exports.default = findKeywordsForTag;
