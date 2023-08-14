import { DocumentModel } from "../models/document";
import { PageModel } from "../models/page";
import { getSignedUrl } from "../services/s3";
import { groupBy } from "lodash";
import mongoose from "mongoose";

export default async function searchByKeyword(
  keyword: string,
  pageNumber: number
): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  const resultsPerPage = 100;
  const skipCount = (pageNumber - 1) * resultsPerPage;

  let documentsResult: (typeof DocumentModel)[] = [];

  if (keyword) {
    console.log("searching for", keyword);
    const pages = await PageModel.find(
      {
        $text: { $search: keyword },
        // "ocr.labelAnnotations.description": "Handwriting",
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(skipCount)
      .limit(resultsPerPage)
      .select({
        ocr: 0,
      })
      .lean();
    const documents: any[] = [];
    for (const page of pages) {
      const document: any = await DocumentModel.findOne({
        "pages._ref.$id": page._id,
      })
        .select({ pages: 0 })
        .lean();
      if (!document) {
        continue;
      }
      documents.push({ ...document, _id: document._id.toString(), page });
    }
    const groupedDocuments = groupBy(documents, (document) => document._id);
    /**
     * get unique documents and merge their page attributes
     */
    const keywordDocumentSearchPromises = Object.values(groupedDocuments).map(
      async (documents) => {
        const document = documents[0];
        const pages = documents.map((document) => document.page);
        let score = 0;
        for (const page of pages) {
          score += page.score;

          /**
           * find matching words from search query
           */
          const matchingWords = keyword
            .toLowerCase()
            .split(" ")
            .filter((word: string) => {
              const regex = new RegExp(`\\b${word}\\b`, "i");
              return regex.test(page.clean_text?.toLowerCase());
            });
          page.matching_words = matchingWords;
          delete page.clean_text;
          if (page.s3_img_object_name) {
            const s3_signed_url = await getSignedUrl(
              "page-img",
              page.s3_img_object_name,
              5
            );
            page.s3_signed_url = s3_signed_url;
          }
        }
        return { ...document, pages, score };
      }
    );
    let keywordDocumentSearchDocuments = await Promise.all(
      keywordDocumentSearchPromises
    );
    documentsResult.push(...keywordDocumentSearchDocuments);

    // @ts-ignore
    documentsResult.sort((a, b) => b.score - a.score);

    console.log("Keyword search documents", documentsResult.length);
  }

  return documentsResult;
}
