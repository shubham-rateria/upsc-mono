import { DocumentModel } from "../models/document";
import { PageModel } from "../models/page";
import { Topper } from "../types";
import mongoose from "mongoose";

const limit = 50;

export default async function searchByTopper(
  topper: Topper,
  pageNumber: number
): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  let documentsResult: (typeof DocumentModel)[] = [];

  if (topper) {
    console.log("searching for", topper);

    // @ts-ignore
    documentsResult = await DocumentModel.find({
      topper: {
        name: topper.name,
        rank: topper.rank,
        year: topper.year,
      },
    })
      .select({
        keyword_tags: 0,
        keyword_tags_1: 0,
        percentage_keywords: 0,
        pages: 0,
      })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .lean();

    console.log(`Found ${documentsResult.length} for topper`);
  }

  return documentsResult;
}
