import { DocumentModel } from "../models/document";
import { PageModel } from "../models/page";
import { SearchParams } from "@usn/common";
import mongoose from "mongoose";

const limit = 50;

export default async function searchByTopper({
  topper,
  pageNumber,
  documentType,
}: SearchParams): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  let documentsResult: (typeof DocumentModel)[] = [];

  if (topper) {
    const query = {
      topper: {
        name: topper.name,
        rank: topper.rank,
        year: topper.year,
      },
    };

    if (documentType !== null && documentType !== undefined) {
      query["document_type"] = documentType;
    }

    // @ts-ignore
    documentsResult = await DocumentModel.find(query)
      .select({
        keyword_tags: 0,
        keyword_tags_1: 0,
        percentage_keywords: 0,
        pages: 0,
      })
      .skip(((pageNumber || 1) - 1) * limit)
      .limit(limit)
      .lean();

    console.log(`Found ${documentsResult.length} for topper`);
  }

  return documentsResult;
}
