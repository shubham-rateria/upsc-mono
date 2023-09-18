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
  const resultsPerPage = 2000;

  const limit = 20;
  const skipCount = (pageNumber - 1) * limit;

  let documentsResult: any[] = [];

  console.log("searching for", keyword, topper);

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
    let l0Categories: any[] = [];

    for (const tag of subjectTags) {
      if (tag.level === "l0") {
        if (!tag.optionalsId) {
          l0Categories.push(mapTagTypeToNumber[tag.type]);
        } else {
          l0Categories.push(tag.optionalsId);
        }
      }
    }

    if (l0Categories.length > 0) {
      additionalDocumentQueries["$match"]["l0_categories"] = {
        $in: l0Categories,
      };
    }

    const l1Tags = subjectTags.filter((tag) => tag.level === "l1");
    if (l1Tags.length > 0) {
      // const keywords = findKeywordsForTag(l1Tags[0]);
      // pipeline.splice(1, 0, {
      //   $match: { "keyword_tags.keyword": { $in: keywords } },
      // });
      additionalDocumentQueries["$match"]["l0_categories"] = [
        mapTagTypeToNumber[l1Tags[0].type],
      ];
    }

    const l2Tags = subjectTags.filter((tag) => tag.level === "l2");
    if (l2Tags.length > 0) {
      // const keywords = findKeywordsForTag(l2Tags[0]);
      // pipeline.splice(1, 0, {
      //   $match: { "keyword_tags.keyword": { $in: keywords } },
      // });
      additionalDocumentQueries["$match"]["l0_categories"] = [
        mapTagTypeToNumber[l2Tags[0].type],
      ];
    }
  }

  if (Object.keys(additionalDocumentQueries.$match).length > 0) {
    pipeline.push(additionalDocumentQueries);
  }

  console.log({ pipeline }, additionalDocumentQueries, topper);

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

  console.log("Keyword search documents", documentsResult.length);

  return documentsResult.slice(skipCount, skipCount + limit);
}

export async function searchByKeywordNot({
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
  const resultsPerPage = 2000;

  const limit = 20;
  const skipCount = (pageNumber - 1) * limit;

  let documentsResult: any[] = [];

  console.log("searching for", keyword, topper);

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
    additionalDocumentQueries["$match"]["document_type"] = {
      $not: { $eq: documentType },
    };
  }

  if (topper) {
    additionalDocumentQueries["$match"]["topper.name"] = {
      $not: { $eq: topper.name },
    };
    additionalDocumentQueries["$match"]["topper.rank"] = {
      $not: { $eq: topper.rank },
    };
    additionalDocumentQueries["$match"]["topper.year"] = {
      $not: { $eq: topper.year },
    };
  }

  if (subjectTags) {
    let l0Categories: any[] = [];

    for (const tag of subjectTags) {
      if (tag.level === "l0") {
        if (!tag.optionalsId) {
          l0Categories.push(mapTagTypeToNumber[tag.type]);
        } else {
          l0Categories.push(tag.optionalsId);
        }
      }
    }

    console.log({ l0Categories });

    if (l0Categories.length > 0) {
      additionalDocumentQueries["$match"]["l0_categories"] = {
        $not: { $in: l0Categories },
      };
    }

    const l1Tags = subjectTags.filter((tag) => tag.level === "l1");
    if (l1Tags.length > 0) {
      additionalDocumentQueries["$match"]["l0_categories"] = {
        $not: { $in: [mapTagTypeToNumber[l1Tags[0].type]] },
      };
    }

    const l2Tags = subjectTags.filter((tag) => tag.level === "l2");
    if (l2Tags.length > 0) {
      additionalDocumentQueries["$match"]["l0_categories"] = {
        $not: { $in: [mapTagTypeToNumber[l2Tags[0].type]] },
      };
    }
  }

  if (Object.keys(additionalDocumentQueries.$match).length > 0) {
    pipeline.push(additionalDocumentQueries);
  }

  console.log({ pipeline }, additionalDocumentQueries, topper);

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

  console.log("Keyword search documents", documentsResult.length);

  return documentsResult.slice(skipCount, skipCount + limit);
}
