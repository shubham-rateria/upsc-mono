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
const referral_plan_1 = require("../../../models/referral_plan");
const user_1 = require("../../../models/user");
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/referral", route);
    route.post("/apply", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, referralCode } = req.body;
        try {
            const referringUser = yield user_1.UserModel.findOne({
                referral_code: referralCode,
            }).exec();
            if (!referringUser) {
                res
                    .status(500)
                    .send({ success: false, message: "Incorrect referral code." })
                    .end();
                return;
            }
            // check if the referral has been applied before
            const oldReferralPlan = yield referral_plan_1.ReferralPlanModel.findOne({
                userId,
            }).exec();
            if (oldReferralPlan) {
                res
                    .status(500)
                    .send({ success: false, message: "Referral already used." });
            }
            const referralPlan = new referral_plan_1.ReferralPlanModel({
                userId,
                referred_by_user_id: referringUser.userId,
                referral_code_used: referralCode,
            });
            yield referralPlan.save();
            res.status(200).send({ success: true }).end();
            return;
        }
        catch (error) {
            res.status(500).send({ success: false }).end();
        }
    }));
    route.post("/get-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const user = yield user_1.UserModel.findOne({
                userId,
            }).exec();
            if (!user) {
                res
                    .status(500)
                    .send({ success: false, message: "User not found" })
                    .end();
                return;
            }
            const referralCode = user.referral_code;
            if (!referralCode) {
                res
                    .status(500)
                    .send({ success: false, message: "System error." })
                    .end();
                return;
            }
            res.status(200).send({ success: true, referralCode }).end();
        }
        catch (error) {
            res.status(500).send({ success: false, message: "System error." }).end();
        }
    }));
};
