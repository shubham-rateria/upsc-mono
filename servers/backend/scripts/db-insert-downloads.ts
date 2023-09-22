import dbLoader from "../loaders/db.loader";
import { UserModel } from "../models/user";
import { FreeDownloadModel } from "../models/free-downloads";
import generateReferralId from "../utils/generate-referral-id";
import { v4 } from "uuid";

const transform = async () => {
  await dbLoader();
  const users = await UserModel.find({});
  for (const user of users) {
    user.referral_code = generateReferralId();
    user.userId = v4();
    await user.save();
    console.log(user.userId);
    const freeDownload = new FreeDownloadModel({
      userId: user.userId,
    });
    await freeDownload.save();
  }
};

transform();
