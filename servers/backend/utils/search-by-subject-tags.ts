import { SearchParams, Tag, TagType, Topper } from "usn-common";
import flattenObject from "./flatten-object";
import { PageModel } from "../models/page";
import { DocumentModel } from "../models/document";
import mongoose from "mongoose";
import { mapTagTypeToCategories, mapTagTypeToNumber } from "usn-common";
import { getSignedUrl } from "../services/s3";

const RESULTS_PER_PAGE = 50;

async function findDocumentsForKeywordsSearch(
  keywords: string[],
  l0Category: number,
  pageNumber: number,
  documentType?: number,
  topper?: Topper
): Promise<(typeof DocumentModel)[]> {
  const skip = (pageNumber - 1) * RESULTS_PER_PAGE;
  const limit = RESULTS_PER_PAGE;

  const pipeline: any[] = [
    {
      $search: {
        index: "page_search",
        compound: {
          should: keywords.map((keyword) => ({
            text: {
              query: keyword,
              path: "clean_text",
            },
          })),
        },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        documentId: 1,
        s3_img_object_name: 1,
        s3_img_object_name_small: 1,
        s3_img_object_name_medium: 1,
        page_number: 1,
        score: {
          $meta: "searchScore",
        },
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

  const additionalQueries = {
    $match: {
      l0_categories: l0Category,
    },
  };

  if (documentType !== null && documentType !== undefined) {
    additionalQueries["$match"]["document_type"] = documentType;
  }

  if (topper) {
    additionalQueries["$match"]["topper.name"] = topper.name;
    additionalQueries["$match"]["topper.rank"] = topper.rank;
    additionalQueries["$match"]["topper.year"] = topper.year;
  }

  console.log({ additionalQueries, documentType });

  pipeline.push(additionalQueries);

  const documentCandidates = await PageModel.aggregate(pipeline).exec();

  let documents: any[] = [];
  // sort the documents
  for (const document of documentCandidates) {
    let scoreSum = 0;
    for (const page of document.pages) {
      scoreSum += page.score;
      if (page.s3_img_object_name_small) {
        const s3_signed_url = await getSignedUrl(
          "page-img",
          page.s3_img_object_name_small,
          5
        );
        page.s3_signed_url = s3_signed_url;
      }
    }

    const pages = document.pages.sort((a, b) => b.score - a.score);
    documents.push({ ...document, pages, score: scoreSum });
  }

  // @ts-ignore
  documents = documents.sort((a, b) => b.score - a.score);

  return documents;
}

async function findDocumentsForKeywords(
  keywords: string[],
  l0Category: number,
  pageNumber: number,
  documentType?: number
): Promise<(typeof DocumentModel)[]> {
  const limit = 5000;
  let pages: any[] = [];

  const pipeline: any[] = [
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
        s3_img_object_name_small: 1,
        s3_img_object_name_medium: 1,
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

  const additionalQueries = {
    $match: {
      l0_categories: l0Category,
    },
  };

  if (documentType) {
    additionalQueries["$match"]["document_type"] = documentType;
  }

  pipeline.push(additionalQueries);

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
      if (page.s3_img_object_name_small) {
        const s3_signed_url = await getSignedUrl(
          "page-img",
          page.s3_img_object_name_small,
          5
        );
        page.s3_signed_url = s3_signed_url;
      }
    }

    const pages = document.pages.sort((a, b) => b.score - a.score);
    documents.push({ ...document, pages, score: scoreSum });
  }

  // @ts-ignore
  documents = documents.sort((a, b) => b.score - a.score);

  return documents.slice(0, 10);
  // return documents;
}

export default async function searchBySubjectTags({
  subjectTags,
  pageNumber = 1,
  documentType,
  topper,
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

        if (topper) {
          documentL0Query["topper.name"] = topper.name;
          documentL0Query["topper.rank"] = topper.rank;
          documentL0Query["topper.year"] = topper.year;
        }

        const l0Results = await DocumentModel.find(documentL0Query)
          .select({
            pages: 0,
            category_tags: 0,
            category_tags_1: 0,
            percentage_keywords: 0,
            median_keywords: 0,
          })
          .skip((pageNumber - 1) * limit)
          .limit(limit)
          .sort({ num_pages: -1 })
          .lean();
        // @ts-ignore
        results.push(...l0Results);

        return results;
      }

      let l0Category: number = -1;

      if (tag.optionalsId) {
        l0Category = tag.optionalsId;
      } else {
        l0Category = mapTagTypeToNumber[tag.type];
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
      const keywordResults = await findDocumentsForKeywordsSearch(
        keywords,
        l0Category,
        pageNumber,
        documentType,
        topper
      );

      console.log("keywordResults", keywordResults.length);

      documentResults.push(...keywordResults);
    }
  }

  return documentResults;
}
