"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateReferralId() {
    const length = 6;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    return result;
}
exports.default = generateReferralId;
