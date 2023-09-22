import { ReferralPlanModel } from "../../../models/referral_plan";
import { UserModel } from "../../../models/user";
import { FileDownloadedModel } from "./../../../models/files-downloaded";
import { Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/referral", route);

  route.post("/apply", async (req: Request, res: Response) => {
    const { userId, referralCode } = req.body;

    try {
      const referringUser = await UserModel.findOne({
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
      const oldReferralPlan = await ReferralPlanModel.findOne({
        userId,
      }).exec();

      if (oldReferralPlan) {
        res
          .status(500)
          .send({ success: false, message: "Referral already used." })
          .end();
        return;
      }

      const referralPlan = new ReferralPlanModel({
        userId,
        referred_by_user_id: referringUser.userId,
        referral_code_used: referralCode,
      });
      await referralPlan.save();
      res.status(200).send({ success: true }).end();
      return;
    } catch (error) {
      res.status(500).send({ success: false }).end();
    }
  });

  route.post("/get-code", async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      const user = await UserModel.findOne({
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
    } catch (error) {
      res.status(500).send({ success: false, message: "System error." }).end();
    }
  });
};
