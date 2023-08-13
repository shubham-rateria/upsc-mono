import gs1Categories from "@/data/gs1-categories";
import gs2Categories from "@/data/gs2-categories";
import gs3Categories from "@/data/gs3-categories";
import gs4Categories from "@/data/gs4-categories";
import optionalsCategories from "@/data/optionals-categories";
import { Tag } from "@/types";
import flattenObject from "./flatten-object";
import { PageModel } from "@/models/page";
import { DocumentModel } from "@/models/document";
import { groupBy } from "lodash";
import { getSignedUrl } from "@/services/s3";
import mongoose from "mongoose";

const mapTagTypeToCategories: any = {
  GS1: gs1Categories,
  GS2: gs2Categories,
  GS3: gs3Categories,
  GS4: gs4Categories,
  Optionals: optionalsCategories,
};

async function findDocumentsForKeywords(keywords: string[]): Promise<(typeof DocumentModel)[]> {
  let pages: any[] = [];
  const pageSearchPromises = [];
  for (const keyword of keywords) {
    const pageSearchPromise = PageModel.find(
      {
        $text: { $search: keyword },
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(0)
      .limit(50)
      .select({
        ocr: 0,
        clean_text: 0,
      })
      .lean();
    pageSearchPromises.push(pageSearchPromise);
  }
  pages = await Promise.all(pageSearchPromises);
  pages = pages.flat();
  console.log("Found pages", pages.length);
  const documents = [];
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
      return { ...document, pages: pages.slice(0, 5), score: scoreSum };
    }
  );
  let uniqueDocuments = await Promise.all(uniqueDocumentsPromise);
  // sort unique documents by score
  uniqueDocuments.sort((a, b) => b.score - a.score);

  console.log("Unique Documents", uniqueDocuments.length);

  return uniqueDocuments;
}

async function findDocumentsForTag(
  tag: Tag
): Promise<(typeof DocumentModel)[]> {
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
    console.log("Finding keywords", keywords);

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

  return await findDocumentsForKeywords(keywords);;
}

export default async function searchBySubjectTags(tags: Tag[]): Promise<(typeof DocumentModel)[]> {
  /**
   * if mongoose is disconnected, throw an error
   */
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected.");
  }

  let documentResults: (typeof DocumentModel)[] = [];

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const documentResult = await findDocumentsForTag(tag);
      documentResults.push(...documentResult);
    }
  }

  return documentResults;

}
