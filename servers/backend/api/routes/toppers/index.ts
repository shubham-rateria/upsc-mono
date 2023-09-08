import { mapTagTypeToNumber } from "usn-common";
import { DocumentModel } from "../../../models/document";
import { Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/toppers", route);

  route.post("/", async (req: Request, res: Response) => {
    const { tag } = req.body;

    let l0Category: number = -1;

    const matchQuery = {
      $match: {
        "topper.name": { $ne: null },
        "topper.rank": { $ne: null },
        "topper.year": { $ne: null },
      },
    };

    if (tag) {
      if (tag.optionalsId) {
        l0Category = tag.optionalsId;
      } else {
        l0Category = mapTagTypeToNumber[tag.type];
      }
      matchQuery.$match["l0_categories"] = l0Category;
    }

    const toppers = await DocumentModel.aggregate([
      matchQuery,
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
