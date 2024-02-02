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
const db_loader_1 = __importDefault(require("../loaders/db.loader"));
const user_1 = require("../models/user");
const free_downloads_1 = require("../models/free-downloads");
const generate_referral_id_1 = __importDefault(require("../utils/generate-referral-id"));
const uuid_1 = require("uuid");
const transform = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_loader_1.default)();
    const users = yield user_1.UserModel.find({});
    for (const user of users) {
        user.referral_code = (0, generate_referral_id_1.default)();
        user.userId = (0, uuid_1.v4)();
        yield user.save();
        console.log(user.userId);
        const freeDownload = new free_downloads_1.FreeDownloadModel({
            userId: user.userId,
        });
        yield freeDownload.save();
    }
});
transform();
