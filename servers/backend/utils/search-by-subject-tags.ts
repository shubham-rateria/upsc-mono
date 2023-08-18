import gs1Categories from "../data/gs1-categories";
import gs2Categories from "../data/gs2-categories";
import gs3Categories from "../data/gs3-categories";
import gs4Categories from "../data/gs4-categories";
import optionalsCategories from "../data/optionals-categories";
import { Tag, TagType } from "../types";
import flattenObject from "./flatten-object";
import { PageModel } from "../models/page";
import { DocumentModel } from "../models/document";
import { groupBy } from "lodash";
import { getSignedUrl } from "../services/s3";
import mongoose from "mongoose";

export const mapTagTypeToCategories: any = {
  GS1: gs1Categories,
  GS2: gs2Categories,
  GS3: gs3Categories,
  GS4: gs4Categories,
  Optionals: optionalsCategories,
};

export const mapTagTypeToNumber: any = {
  Agriculture: 17,
  Anthropology: 6,
  Chemistry: 7,
  Economics: 8,
  GS1: 1,
  GS2: 2,
  GS3: 3,
  GS4: 4,
  Geography: 9,
  Hindi: 10,
  Law: 11,
  Management: 12,
  Philosophy: 13,
  "Political Science": 14,
  "Public Administration": 15,
  Sociology: 16,
  Essay: 5,
};

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
        score: "$keyword_tags.score", // Include the score from keyword_tags
      },
    },
  ]);

  console.log("Found pages", pages.length);

  // for (const page of pages) {
  //   let pageScore = 0;
  //   try {
  //     // for (const k of page.keyword_tags) {
  //     //   if (keywords.includes(k.keyword)) {
  //     //     // console.log("matching keyword", k);
  //     //     pageScore += k.score;
  //     //   }
  //     // }
  //   } catch (error) {
  //     console.error("error score", page, error);
  //   }

  //   page.score = pageScore;
  // }

  const documents: any[] = [];
  for (const page of pages) {
    const document: any = await DocumentModel.findOne({
      "pages._ref.$id": page._id,
      l0_categories: mapTagTypeToNumber[tagType],
    })
      .select({
        pages: 0,
        category_tags: 0,
        keyword_tags: 0,
        category_tags_1: 0,
        keyword_tags_1: 0,
        percentage_keywords: 0,
        median_keywords: 0,
      })
      .lean();
    if (!document) {
      continue;
    }
    documents.push({ ...document, _id: document._id.toString(), page });
  }
  console.log("Found documents", documents.length);
  const groupedDocuments = groupBy(documents, (document) => document._id);
  /**
   * get unique documents and merge their page attributes
   */
  const uniqueDocumentsPromise = Object.values(groupedDocuments).map(
    async (documents) => {
      const document = documents[0];
      let pages = documents.map((document) => document.page);
      let scoreSum = 0;
      for (const page of pages) {
        if (page.s3_img_object_name) {
          const s3_signed_url = await getSignedUrl(
            "page-img",
            page.s3_img_object_name,
            5
          );
          page.s3_signed_url = s3_signed_url;
        }
        scoreSum += page.score;
      }
      delete document.page;
      pages = pages.sort((a, b) => b.score - a.score);
      return { ...document, pages, score: scoreSum };
    }
  );
  let uniqueDocuments = await Promise.all(uniqueDocumentsPromise);
  // sort unique documents by score
  uniqueDocuments.sort((a, b) => b.score - a.score);

  console.log("Unique Documents", uniqueDocuments.length);

  return uniqueDocuments;
}

export const getKeywordsForTag = (tag: Tag) => {
  const categoryFilter = mapTagTypeToCategories[tag.type];
  let keywords: string[] = [];
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
  return keywords;
};

async function findDocumentsForTag(
  tag: Tag,
  pageNumber: number
): Promise<(typeof DocumentModel)[]> {
  const categoryFilter = mapTagTypeToCategories[tag.type];
  let keywords: string[] = [];
  let results: (typeof DocumentModel)[] = [];

  const limit = 10;

  if (tag.level === "l0") {
    const l0Results = await DocumentModel.find({
      l0_categories: mapTagTypeToNumber[tag.type],
    })
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

export default async function searchBySubjectTags(
  tags: Tag[],
  pageNumber: number
): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  let documentResults: (typeof DocumentModel)[] = [];

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const documentResult = await findDocumentsForTag(tag, pageNumber);
      documentResults.push(...documentResult);
    }
  }

  return documentResults;
}
