import { DocumentModel } from "../../../models/document";
import { Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/toppers", route);

  route.get("/", async (req: Request, res: Response) => {
    const toppers = await DocumentModel.aggregate([
      {
        $match: {
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
  });
};
