import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../services/db/connect";
import { PageModel } from "@/models/page";
import { DocumentModel } from "@/models/document";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "GET") {
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
          name: {$first: "$topper.name"},
          rank: { $first: "$topper.rank" },
          year: { $first: "$topper.year" },
        },
      },
    ]).exec();
    res.json({ data: toppers });
  }
}
