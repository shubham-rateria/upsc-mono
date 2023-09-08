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
const usn_common_1 = require("usn-common");
const document_1 = require("../../../models/document");
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/toppers", route);
    route.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tag } = req.body;
        let l0Category = -1;
        if (tag.optionalsId) {
            l0Category = tag.optionalsId;
        }
        else {
            l0Category = usn_common_1.mapTagTypeToNumber[tag.type];
        }
        const toppers = yield document_1.DocumentModel.aggregate([
            {
                $match: {
                    l0_categories: l0Category,
                    "topper.name": { $ne: null },
                    "topper.rank": { $ne: null },
                    "topper.year": { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$topper.name",
                    name: { $first: "$topper.name" },
                    rank: { $first: "$topper.rank" },
                    year: { $first: "$topper.year" },
                },
            },
        ]).exec();
        res.json({ data: toppers });
    }));
};
