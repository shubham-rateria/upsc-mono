import { SearchParams, Tag, TagType } from "usn-common";
import flattenObject from "./flatten-object";
import { PageModel } from "../models/page";
import { DocumentModel } from "../models/document";
import mongoose from "mongoose";
import { mapTagTypeToCategories, mapTagTypeToNumber } from "usn-common";
import { groupBy } from "lodash";
import { getSignedUrl } from "../services/s3";

async function findDocumentsForKeywords(
  keywords: string[],
  tagType: TagType,
  pageNumber: number,
  documentType?: number
): Promise<(typeof DocumentModel)[]> {
  const limit = 5000;
  let pages: any[] = [];

  const pipeline = [
    {
      $match: {
        "keyword_tags.keyword": { $in: keywords },
      },
    },
    {
      $skip: 0,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        keyword_tags: 1,
        documentId: 1,
        s3_img_object_name: 1,
        page_number: 1,
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
        documentIdObjectId: { $toObjectId: "$_id" },
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
  ];

  const additionalQueries = {};

  if (documentType) {
    additionalQueries["$match"] = {
      document_type: documentType,
    };
  }

  const documentCandidates = await PageModel.aggregate(pipeline).exec();

  let documents: any[] = [];
  // sort the documents
  for (const document of documentCandidates) {
    let scoreSum = 0;
    for (const page of document.pages) {
      let pageScore = 0;

      // keywords can be present multiple times,
      // this prevents them from being added again to the score
      const checkedKeywords: any[] = [];
      try {
        for (const k of page.keyword_tags) {
          if (
            keywords.includes(k.keyword) &&
            !checkedKeywords.includes(k.keyword)
          ) {
            pageScore += k.score;
            checkedKeywords.push(k.keyword);
          }
        }
      } catch (error) {
        console.error("error score", page);
      }
      scoreSum += pageScore;
      page.score = pageScore;
      delete page.keyword_tags;
      if (page.s3_img_object_name) {
        const s3_signed_url = await getSignedUrl(
          "page-img",
          page.s3_img_object_name,
          5
        );
        page.s3_signed_url = s3_signed_url;
      }
    }

    const pages = document.pages.sort((a, b) => b.score - a.score);
    documents.push({ ...document, pages, score: scoreSum });
  }

  // pages = await PageModel.find({
  //   "keyword_tags.keyword": { $in: keywords },
  // })
  //   .select({
  //     ocr: 0,
  //     category_tags: 0,
  //     category_tags_1: 0,
  //     keyword_tags_1: 0,
  //     clean_text: 0,
  //   })
  //   // .sort({ "keyword_tags.score": -1 })
  //   .skip(0)
  //   .limit(limit)
  //   .lean();

  // const groupedPages = groupBy(pages, (page) => page.documentId);

  // console.log("Found pages", pages.length);

  // let documents: (typeof DocumentModel)[] = [];

  // const additionalQueries = {};

  // if (documentType) {
  //   additionalQueries["document_type"] = documentType;
  // }

  // for (const documentId of Array.from(Object.keys(groupedPages))) {
  //   const document: any = await DocumentModel.findOne({
  //     _id: new mongoose.Types.ObjectId(documentId),
  //     l0_categories: mapTagTypeToNumber[tagType],
  //     ...additionalQueries,
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

  //   document.pages = groupedPages[documentId];

  //   let scoreSum = 0;

  //   for (const page of document.pages) {
  //     let pageScore = 0;

  //     // keywords can be present multiple times,
  //     // this prevents them from being added again to the score
  //     const checkedKeywords: any[] = [];
  //     try {
  //       for (const k of page.keyword_tags) {
  //         if (
  //           keywords.includes(k.keyword) &&
  //           !checkedKeywords.includes(k.keyword)
  //         ) {
  //           pageScore += k.score;
  //           checkedKeywords.push(k.keyword);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("error score", page);
  //     }
  //     scoreSum += pageScore;
  //     page.score = pageScore;
  //     delete page.keyword_tags;
  //     if (page.s3_img_object_name) {
  //       const s3_signed_url = await getSignedUrl(
  //         "page-img",
  //         page.s3_img_object_name,
  //         5
  //       );
  //       page.s3_signed_url = s3_signed_url;
  //     }
  //   }

  //   const pages = document.pages.sort((a, b) => b.score - a.score);
  //   documents.push({ ...document, pages, score: scoreSum });
  // }

  // @ts-ignore
  documents = documents.sort((a, b) => b.score - a.score);

  return documents.slice(0, 10);
  // return documents;
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
    pageNumber,
    documentType
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
