"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flattenObject(obj) {
    const result = [];
    function extractLeafValues(obj) {
        if (typeof obj === "object" && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach((item) => extractLeafValues(item));
            }
            else {
                for (const key in obj) {
                    result.push(key);
                    extractLeafValues(obj[key]);
                }
            }
        }
        else {
            result.push(obj);
        }
    }
    extractLeafValues(obj);
    return result;
}
exports.default = flattenObject;
