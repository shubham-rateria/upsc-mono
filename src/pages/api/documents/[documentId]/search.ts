import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../../services/db/connect";
import { getDocumentById } from "../../../../services/db/document";
import { getSignedUrl } from "@/services/s3";
import { PageModel } from "@/models/page";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

async function performTextSearch(ids: string[], searchTerm: string) {
  const objectIds = ids.map((id) => new ObjectId(id));
  const matchingPages = await PageModel.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: "textScore" } }
  )
    .lean()
    .exec();
  // @ts-ignore
  const keepPages = matchingPages.filter((page) => objectIds.some(page._id));
  return keepPages;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { documentId } = req.query;
      const { searchTerm } = req.body;

      const document = await getDocumentById(documentId as string);

      if (!document) {
        res.status(500).json({ success: false });
        return;
      }

      // @ts-ignore
      const pageIds = document?.pages.map((page) => page._ref.oid.toString());

      const searchResultPromises = [];

      for (const pageId of pageIds) {
        const search = PageModel.find({
          _id: new ObjectId(pageId),
          $text: { $search: searchTerm },
        })
          .lean()
          .exec();
        searchResultPromises.push(search);
      }

      const results = (await Promise.all(searchResultPromises))
        .map((r) => {
          if (r.length > 0) {
            const matching_words = searchTerm
              .toLowerCase()
              .split(" ")
              .filter((word: string) => {
                const regex = new RegExp(`\\b${word}\\b`, "i");
                return regex.test(r[0].clean_text?.toLowerCase());
              });
            return { matching_words, page_number: r[0].page_number };
          }
        })
        .filter((r) => r);

      res.status(201).json({ success: true, data: { pages: results } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
