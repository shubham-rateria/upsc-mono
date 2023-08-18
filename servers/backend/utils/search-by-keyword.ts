import { DocumentModel } from "../models/document";
import { PageModel } from "../models/page";
import { getSignedUrl } from "../services/s3";
import { groupBy } from "lodash";
import mongoose from "mongoose";
import { SearchClient as TypesenseSearchClient } from "typesense";
import { getBOWFromString } from "./get-bow";

// let client = new TypesenseSearchClient({
//   nodes: [
//     {
//       host: "localhost", // For Typesense Cloud use xxx.a1.typesense.net
//       port: 8108, // For Typesense Cloud use 443
//       protocol: "http", // For Typesense Cloud use https
//     },
//   ],
//   apiKey: "xyz",
//   connectionTimeoutSeconds: 2,
// });

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

  const searchParameters = {
    q: getBOWFromString(keyword).join(" "),
    query_by: "clean_text",
    exclude_fields: "keyword_tags",
    group_by: "documentId",
    group_limit: 10,
    prioritize_exact_match: true,
    pre_segmented_query: true,
    prefix: false,
    // exhaustive_search: true,
    per_page: 20,
    page: pageNumber,
  };

  // const results = await client
  //   .collections("pages")
  //   .documents()
  //   .search(searchParameters, {});

  // console.log({ results });

  // for (const result of results.grouped_hits || []) {
  //   const document: any = await DocumentModel.findById(result["group_key"][0])
  //     .select({
  //       percentage_tags: 0,
  //       keyword_tags: 0,
  //       keyword_tags_1: 0,
  //       category_tags: 0,
  //     })
  //     .lean();
  //   const pages: any[] = [];
  //   for (const hit of result["hits"]) {
  //     // @ts-ignore
  //     const id = hit.document.id;
  //     const page: any = await PageModel.findById(id)
  //       .select({
  //         ocr: 0,
  //         keyword_tags: 0,
  //         keyword_tags_1: 0,
  //         category_tags: 0,
  //         category_tags_1: 0,
  //         clean_text: 0,
  //       })
  //       .lean();
  //     page.matching_words = hit["highlight"]["clean_text"]["matched_tokens"];
  //     if (page.s3_img_object_name) {
  //       const s3_signed_url = await getSignedUrl(
  //         "page-img",
  //         page.s3_img_object_name,
  //         5
  //       );
  //       page.s3_signed_url = s3_signed_url;
  //     }
  //     pages.push(page);
  //   }
  //   document.pages = pages;
  //   documentsResult.push(document);
  // }

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
        category_tags: 0,
        keyword_tags_1: 0,
        clean_text: 0,
      })
      .lean();

    console.log("found pages", pages.length);

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
