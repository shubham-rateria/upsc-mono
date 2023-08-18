import { SearchParams, Tag, TagType } from "@usn/common";
import flattenObject from "./flatten-object";
import { PageModel } from "../models/page";
import { DocumentModel } from "../models/document";
import mongoose from "mongoose";
import { mapTagTypeToCategories, mapTagTypeToNumber } from "@usn/common";

async function findDocumentsForKeywords(
  keywords: string[],
  tagType: TagType,
  pageNumber: number
): Promise<(typeof DocumentModel)[]> {
  const limit = 100;
  let pages: any[] = [];
  pages = await PageModel.aggregate([
    {
      $match: {
        "keyword_tags.keyword": { $in: keywords },
      },
    },
    {
      $unwind: "$keyword_tags",
    },
    {
      $match: {
        "keyword_tags.keyword": { $in: keywords },
      },
    },
    {
      $sort: {
        "keyword_tags.score": -1,
      },
    },
    {
      $skip: (pageNumber - 1) * limit, // Number of documents to skip
    },
    {
      $limit: limit, // Number of documents to limit
    },
    {
      $project: {
        _id: 1,
        keyword_tags: 1,
        s3_img_object_name: 1,
        page_number: 1,
        documentId: 1,
        score: "$keyword_tags.score", // Include the score from keyword_tags
      },
    },
    {
      $group: {
        _id: "$documentId",
        pages: {
          $push: "$$ROOT",
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
        documentId: "$_id",
        pages: 1,
        s3_object_name: "$targetDoc.s3_object_name",
        topper: "$targetDoc.topper",
        l0_categories: "$targetDoc.l0_categories",
        num_pages: "$targetDoc.num_pages",
        document_type: "$targetDoc.document_type",
      },
    },
  ]);

  console.log("Found pages", pages.length);

  // const documents: any[] = [];
  // for (const page of pages) {
  //   const document: any = await DocumentModel.findOne({
  //     "pages._ref.$id": page._id,
  //     l0_categories: mapTagTypeToNumber[tagType],
  //   })
  //     .select({
  //       pages: 0,
  //       category_tags: 0,
  //       keyword_tags: 0,
  //       category_tags_1: 0,
  //       keyword_tags_1: 0,
  //       percentage_keywords: 0,
  //       median_keywords: 0,
  //     })
  //     .lean();
  //   if (!document) {
  //     continue;
  //   }
  //   documents.push({ ...document, _id: document._id.toString(), page });
  // }
  // console.log("Found documents", documents.length);
  // const groupedDocuments = groupBy(documents, (document) => document._id);
  // /**
  //  * get unique documents and merge their page attributes
  //  */
  // const uniqueDocumentsPromise = Object.values(groupedDocuments).map(
  //   async (documents) => {
  //     const document = documents[0];
  //     let pages = documents.map((document) => document.page);
  //     let scoreSum = 0;
  //     for (const page of pages) {
  //       if (page.s3_img_object_name) {
  //         const s3_signed_url = await getSignedUrl(
  //           "page-img",
  //           page.s3_img_object_name,
  //           5
  //         );
  //         page.s3_signed_url = s3_signed_url;
  //       }
  //       scoreSum += page.score;
  //     }
  //     delete document.page;
  //     pages = pages.sort((a, b) => b.score - a.score);
  //     return { ...document, pages, score: scoreSum };
  //   }
  // );
  // let uniqueDocuments = await Promise.all(uniqueDocumentsPromise);
  // // sort unique documents by score
  // uniqueDocuments.sort((a, b) => b.score - a.score);

  // console.log("Unique Documents", uniqueDocuments.length);

  // return uniqueDocuments;

  return pages;
}

async function findDocumentsForTag(
  tag: Tag,
  pageNumber: number,
  documentType?: number
): Promise<(typeof DocumentModel)[]> {
  const categoryFilter = mapTagTypeToCategories[tag.type];
  let keywords: string[] = [];
  let results: (typeof DocumentModel)[] = [];

  const limit = 10;

  if (tag.level === "l0") {
    const documentL0Query = {};

    if (documentType !== null && documentType !== undefined) {
      documentL0Query["document_type"] = documentType;
    }

    if (tag.optionalsId) {
      documentL0Query["l0_categories"] = tag.optionalsId;
    } else {
      documentL0Query["l0_categories"] = mapTagTypeToNumber[tag.type];
    }

    const l0Results = await DocumentModel.find(documentL0Query)
      .select({ pages: 0 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .lean();
    // @ts-ignore
    results.push(...l0Results);
  }
  if (tag.level === "l1") {
    // find key in cateogryFilter.cateogries
    let categoryObject = {};
    for (const category of categoryFilter.categories) {
      Object.keys(category).forEach((key) => {
        if (key === tag.value.tagText) {
          categoryObject = category;
        }
      });
    }
    // flatten the category object
    keywords = flattenObject(categoryObject);
    keywords.push(tag.value.tagText);
  }
  if (tag.level === "l2") {
    let categoryObject = {};
    for (const category of categoryFilter.categories) {
      Object.keys(category).forEach((key) => {
        // @ts-ignore
        Object.keys(category[key]).forEach((subKey) => {
          if (subKey === tag.value.tagText) {
            // @ts-ignore
            categoryObject = category[key][subKey];
          }
        });
      });
    }
    // flatten the category object
    keywords = flattenObject(categoryObject);
    keywords.push(tag.value.tagText);
  }

  console.log("Finding keywords", keywords);
  const bowResults = await findDocumentsForKeywords(
    keywords,
    tag.type,
    pageNumber
  );

  console.log("bowResults", bowResults.length);

  results.push(...bowResults);

  return results;
}

export default async function searchBySubjectTags({
  subjectTags,
  pageNumber,
  documentType,
}: SearchParams): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  let documentResults: (typeof DocumentModel)[] = [];

  if (subjectTags && subjectTags.length > 0) {
    for (const tag of subjectTags) {
      const documentResult = await findDocumentsForTag(
        tag,
        pageNumber || 0,
        documentType
      );
      documentResults.push(...documentResult);
    }
  }

  return documentResults;
}
