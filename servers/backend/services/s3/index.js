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
exports.getSignedUrl = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Set your AWS credentials and region
aws_sdk_1.default.config.update({
    accessKeyId: 'AKIATNMSO37KTJZYLPCJ',
    secretAccessKey: 'OywlmVBlGs5JI+kBKwL5Jjy/2s6Ml4/c6J4A7n3E',
    region: 'ap-south-1'
});
// Function to get a signed URL for an S3 object
function getSignedUrl(bucketName, objectKey, expiresInMinutes) {
    return __awaiter(this, void 0, void 0, function* () {
        const s3 = new aws_sdk_1.default.S3();
        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Expires: expiresInMinutes * 60 // Convert minutes to seconds
        };
        return new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', params, (err, url) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    });
}
exports.getSignedUrl = getSignedUrl;
