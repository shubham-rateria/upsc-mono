import { FileDownloadedModel } from "./../../../models/files-downloaded";
import { Request, Response, Router } from "express";
import { FreeDownloadModel } from "../../../models/free-downloads";
import { ReferralPlanModel } from "../../../models/referral_plan";
import { PaymentModel } from "../../../models/payment";

const route = Router();

export default (app: Router) => {
  app.use("/usage", route);

  route.post("/file-download", async (req: Request, res: Response) => {
    const { userId, fileS3ObjectName, downloaded_through_plan } = req.body;
    try {
      const fileDownload = new FileDownloadedModel({
        downloaded_on: Date.now(),
        downloaded_through_plan,
        fileS3ObjectName,
        userId,
      });
      await fileDownload.save();
      res.status(200).send({ success: true }).end();
      return;
    } catch (error) {
      console.error("Error in setting downloaded", error);
      res.status(500).send({ success: false }).end();
    }
  });

  route.post("/remaining-downloads", async (req: Request, res: Response) => {
    // get total downloads the user has done
    // get downloads in the free plan,
    // get downloads in the paid plan

    const { userId } = req.body;

    try {
      const filesDownloaded = await FileDownloadedModel.find({
        userId,
      }).exec();
      const freeDownloads = filesDownloaded.filter(
        (f) => f.downloaded_through_plan === 0
      );
      const singleDownloads = await PaymentModel.find({
        user_id: userId,
        download_plan: "0",
      }).exec();
      //   const paidDownloads = filesDownloaded.filter(
      //     (f) => f.downloaded_through_plan === 1
      //   );
      const freePlan = await FreeDownloadModel.findOne({
        userId,
      }).exec();
      const referralPlan = await ReferralPlanModel.find({
        referred_by_user_id: userId,
      }).exec();
      const freePlanDownloads = freePlan?.downloads || 0;
      const referralPlanDownloads = referralPlan
        .map((p) => p.num_downloads || 0)
        .reduce(
          (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
          0
        );

      const totalFreeDownloads =
        freePlanDownloads + referralPlanDownloads + singleDownloads.length;
      const freeDownloadsRemaining = totalFreeDownloads - freeDownloads.length;

      res
        .status(200)
        .send({ success: true, free: freeDownloadsRemaining })
        .end();
    } catch (error) {
      res.status(500).send({ success: false });
    }
  });
};
