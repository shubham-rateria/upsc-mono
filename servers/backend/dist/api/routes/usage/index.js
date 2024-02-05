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
const files_downloaded_1 = require("./../../../models/files-downloaded");
const express_1 = require("express");
const free_downloads_1 = require("../../../models/free-downloads");
const referral_plan_1 = require("../../../models/referral_plan");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/usage", route);
    route.post("/file-download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, fileS3ObjectName } = req.body;
        try {
            const fileDownload = new files_downloaded_1.FileDownloadedModel({
                downloaded_on: Date.now(),
                downloaded_through_plan: 0,
                fileS3ObjectName,
                userId,
            });
            yield fileDownload.save();
            res.status(200).send({ success: true }).end();
            return;
        }
        catch (error) {
            console.error("Error in setting downloaded", error);
            res.status(500).send({ success: false }).end();
        }
    }));
    route.post("/remaining-downloads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // get total downloads the user has done
        // get downloads in the free plan,
        // get downloads in the paid plan
        const { userId } = req.body;
        try {
            const filesDownloaded = yield files_downloaded_1.FileDownloadedModel.find({
                userId,
            }).exec();
            const freeDownloads = filesDownloaded.filter((f) => f.downloaded_through_plan === 0);
            //   const paidDownloads = filesDownloaded.filter(
            //     (f) => f.downloaded_through_plan === 1
            //   );
            const freePlan = yield free_downloads_1.FreeDownloadModel.findOne({
                userId,
            }).exec();
            const referralPlan = yield referral_plan_1.ReferralPlanModel.find({
                referred_by_user_id: userId,
            }).exec();
            const freePlanDownloads = (freePlan === null || freePlan === void 0 ? void 0 : freePlan.downloads) || 0;
            const referralPlanDownloads = referralPlan
                .map((p) => p.num_downloads || 0)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            console.log({
                freePlanDownloads,
                referralPlanDownloads,
                referralPlan,
                userId,
            });
            const totalFreeDownloads = freePlanDownloads + referralPlanDownloads;
            const freeDownloadsRemaining = totalFreeDownloads - freeDownloads.length;
            res
                .status(200)
                .send({ success: true, free: freeDownloadsRemaining })
                .end();
        }
        catch (error) {
            res.status(500).send({ success: false });
        }
    }));
};
