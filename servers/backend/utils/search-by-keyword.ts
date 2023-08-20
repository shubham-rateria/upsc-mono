import { DocumentModel } from "../models/document";
import { PageModel } from "../models/page";
import { getSignedUrl } from "../services/s3";
import { cloneDeep, groupBy } from "lodash";
import mongoose from "mongoose";
import { mapTagTypeToNumber, type SearchParams } from "usn-common";
import findKeywordsForTag from "./get-keywords-for-tag";

export default async function searchByKeyword({
  keyword,
  pageNumber = 1,
  documentType,
  subjectTags,
  topper,
}: SearchParams): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  /**
   * In search by keyword, we will paginate the final document output rather
   * than paginating the aggregation. This is because with mongodb search has to be
   * the first stage of the aggregation pipeline.
   *
   * We can safely assume a number of 5000 results, since that is about 5%
   * of our pages dataset and no result post that number in a sorted order should
   * be relevant anyway
   */
  const resultsPerPage = 3000;

  const limit = 30;
  const skipCount = (pageNumber - 1) * limit;

  let documentsResult: any[] = [];

  console.log("searching for", keyword);

  const pipeline: any = [
    {
      $search: {
        index: "page_search",
        text: {
          query: keyword,
          path: "clean_text",
        },
        highlight: {
          path: "clean_text", // Replace with the same field you are searching in
        },
      },
    },
    {
      $skip: 0, // Replace pageNumber and pageSize with your desired values
    },
    {
      $limit: resultsPerPage, // Replace pageSize with your desired value
    },
    {
      $project: {
        documentId: 1,
        page_number: 1,
        s3_img_object_name: 1,
        highlights: { $meta: "searchHighlights" },
        score: {
          $meta: "searchScore",
        },
      },
    },
    // {
    //   $group: {
    //     _id: "$documentId",
    //     pages: {
    //       $push: "$$ROOT",
    //     },
    //   },
    // },
    {
      $addFields: {
        documentIdObjectId: { $toObjectId: "$documentId" },
      },
    },
    {
      $lookup: {
        from: "document",
        // Replace with your target collection name
        localField: "documentIdObjectId",
        foreignField: "_id",
        as: "targetDoc",
      },
    },
    {
      $unwind: "$targetDoc",
    },
    {
      $project: {
        documentId: 1,
        pages: 1,
        s3_object_name: "$targetDoc.s3_object_name",
        topper: "$targetDoc.topper",
        l0_categories: "$targetDoc.l0_categories",
        num_pages: "$targetDoc.num_pages",
        document_type: "$targetDoc.document_type",
        page_number: 1,
        s3_img_object_name: 1,
        highlights: { $meta: "searchHighlights" },
      },
    },
  ];

  const additionalDocumentQueries = { $match: {} };

  if (documentType !== null && documentType !== undefined) {
    additionalDocumentQueries["$match"]["document_type"] = documentType;
  }

  if (topper) {
    additionalDocumentQueries["$match"]["topper.name"] = topper.name;
    additionalDocumentQueries["$match"]["topper.rank"] = topper.rank;
    additionalDocumentQueries["$match"]["topper.year"] = topper.year;
  }

  if (subjectTags) {
    // find l0 subject tags
    const l0Tags = subjectTags.filter((tag) => tag.level === "l0");
    if (l0Tags.length > 0) {
      additionalDocumentQueries["$match"]["l0_categories"] = l0Tags.map(
        (tag) => mapTagTypeToNumber[tag.type]
      );
    }

    const l1Tags = subjectTags.filter((tag) => tag.level === "l1");
    if (l1Tags.length > 0) {
      const keywords = findKeywordsForTag(l1Tags[0]);
      pipeline.splice(1, 0, {
        $match: { "keyword_tags.keyword": { $in: keywords } },
      });
      additionalDocumentQueries["$match"]["l0_categories"] = [
        mapTagTypeToNumber[l1Tags[0].type],
      ];
    }

    const l2Tags = subjectTags.filter((tag) => tag.level === "l2");
    if (l2Tags.length > 0) {
      const keywords = findKeywordsForTag(l2Tags[0]);
      pipeline.splice(1, 0, {
        $match: { "keyword_tags.keyword": { $in: keywords } },
      });
      additionalDocumentQueries["$match"]["l0_categories"] = [
        mapTagTypeToNumber[l2Tags[0].type],
      ];
    }
  }

  console.log({ pipeline });

  if (Object.keys(additionalDocumentQueries.$match).length > 0) {
    pipeline.push(additionalDocumentQueries);
  }

  const pages = await PageModel.aggregate(pipeline).exec();

  console.log("found docs", pages.length);

  const docMap = new Map();

  for (const page of pages) {
    if (!docMap.has(page.documentId)) {
      const data = {
        _id: page.documentId,
        documentId: page.documentId,
        num_pages: page.num_pages,
        s3_object_name: page.s3_object_name,
        l0_categories: page.l0_categories,
        topper: page.topper,
        pages: new Map(),
      };
      docMap.set(page.documentId, data);
    }

    page.matching_words = [];

    page.highlights.forEach((highlight) => {
      highlight.texts.forEach((text) => {
        if (text.type === "hit") {
          page.matching_words.push(text.value.toLowerCase());
        }
      });
    });

    page.matching_words = Array.from(new Set(page.matching_words));

    delete page.highlights;

    if (page.s3_img_object_name) {
      const s3_signed_url = await getSignedUrl(
        "page-img",
        page.s3_img_object_name,
        5
      );
      page.s3_signed_url = s3_signed_url;
    }

    const pageMap = docMap.get(page.documentId).pages;
    pageMap.set(Array.from(pageMap.keys()).length, page);
  }

  docMap.forEach((value, key) => {
    const pages = docMap.get(key).pages;
    documentsResult.push({ ...value, pages: Array.from(pages.values()) });
  });

  /**
   * this approach of summing up page scores tend to boost the score of the
   * document for which there are a lot of pages with small page scores
   *
   * we would rather preserve the order of the page scoring the group
   * the pages in a horizontal (page order) and vertical (document order)
   * according to page score
   */

  // for (const document of pages) {
  //   // @ts-ignore
  //   let pages = document.pages;

  //   let score = 0;
  //   for (const page of pages) {
  //     score += page.score;
  //     page.matching_words = [];
  //     /**
  //      * find matching words from search query
  //      */
  //     // const matchingWords = keyword
  //     //   .toLowerCase()
  //     //   .split(" ")
  //     //   .filter((word: string) => {
  //     //     const regex = new RegExp(`\\b${word}\\b`, "i");
  //     //     return regex.test(page.clean_text?.toLowerCase());
  //     //   });
  //     // page.matching_words = matchingWords;
  //     // delete page.clean_text;

  //     page.highlights.forEach((highlight) => {
  //       highlight.texts.forEach((text) => {
  //         if (text.type === "hit") {
  //           page.matching_words.push(text.value.toLowerCase());
  //         }
  //       });
  //     });

  //     page.matching_words = Array.from(new Set(page.matching_words));

  //     delete page.highlights;

  //     if (page.s3_img_object_name) {
  //       const s3_signed_url = await getSignedUrl(
  //         "page-img",
  //         page.s3_img_object_name,
  //         5
  //       );
  //       page.s3_signed_url = s3_signed_url;
  //     }
  //   }

  //   // @ts-ignore
  //   document.score = score;
  //   document.pages = pages;
  // }

  // documentsResult = pages;
  // @ts-ignore
  // documentsResult.sort((a, b) => b.score - a.score);

  console.log("Keyword search documents", documentsResult.length);

  return documentsResult.slice(skipCount, skipCount + limit);
}
