"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const toppers_1 = __importDefault(require("./routes/toppers"));
const documents_1 = __importDefault(require("./routes/documents"));
const user_1 = __importDefault(require("./routes/user"));
const referral_1 = __importDefault(require("./routes/referral"));
const usage_1 = __importDefault(require("./routes/usage"));
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, toppers_1.default)(app);
    (0, documents_1.default)(app);
    (0, user_1.default)(app);
    (0, referral_1.default)(app);
    (0, usage_1.default)(app);
    return app;
};
