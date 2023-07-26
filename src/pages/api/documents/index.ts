import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../services/db/connect";
import { getDocumentByS3ObjectName } from "../../../services/db/document";
import { PageModel } from "@/models/page";
import { DocumentModel } from "@/models/document";
import { groupBy } from "lodash";
import { getSignedUrl } from "@/services/s3";
import flattenObject from "../../../utils/flattern-object";
import gs1Categories from "../../../data/gs1-categories";
import gs2Categories from "../../../data/gs2-categories";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { s3_object_name } = req.query;

      console.log("getting s3 object", s3_object_name);

      const document = await getDocumentByS3ObjectName(
        s3_object_name as string
      );
      console.log({ document });

      res.status(201).json({ success: true, data: document });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "PUT") {
    const { search, pageNumber, documentType } = req.body;
    const resultsPerPage = 100;
    const skipCount = (pageNumber - 1) * resultsPerPage;
    const pages = await PageModel.find(
      { $text: { $search: search } },
      { score: { $meta: "textScore" } },
      { "ocr.labelAnnotations.description": "Handwriting" }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(skipCount)
      .limit(resultsPerPage)
      .select({
        ocr: 0,
      })
      .lean();
    res.status(200).json({ success: true, data: pages });
  } else if (req.method === "POST") {
    const { search, pageNumber, documentType, tagType } = req.body;
    let documentsResult: any[] = [];
    const resultsPerPage = 100;
    const skipCount = (pageNumber - 1) * resultsPerPage;

    if (search) {
      console.log("searching for", search);
      const pages = await PageModel.find(
        {
          $text: { $search: search },
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
        documents.push({ ...document, _id: document._id.toString() , page });
      }
      const groupedDocuments = groupBy(documents, (document) => document._id);
      /**
       * get unique documents and merge their page attributes
       */
      const keywordDocumentSearchPromises = Object.values(groupedDocuments).map(
        async (documents) => {
          const document = documents[0];
          const pages = documents.map((document) => document.page);
          for (const page of pages) {
            /**
             * find matching words from search query
             */
            const matchingWords = search
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
          return { ...document, pages };
        }
      );
      let keywordDocumentSearchDocuments = await Promise.all(
        keywordDocumentSearchPromises
      );
      documentsResult.push(...keywordDocumentSearchDocuments);
      console.log("Keyword search documents", documentsResult.length);
    }

    /**
     * see if there are any filter tags
     * if there are find pages that turn under that search
     */
    const mapTagTypeToCategories: any = {
      "GS1": gs1Categories,
      "GS2": gs2Categories,
    }
    if (tagType) {

      const categoryFilter = mapTagTypeToCategories[tagType.type];

      if (tagType.level === "l1") {
        // find key in cateogryFilter.cateogries
        let categoryObject = {};
        for (const category of categoryFilter.categories) {
          Object.keys(category).forEach((key) => {
            if (key === tagType.value.tagText) {
              categoryObject = category;
            }
          });
        }
        // flatten the category object
        const keywords = flattenObject(categoryObject);
        keywords.push(tagType.value.tagText);
        console.log("Finding keywords", keywords);
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
          documents.push({ ...document, _id: document._id.toString() , page });
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

        if (documentsResult.length > 0) {
          // find the common documents between uniqueDocuments and documentsResult
          const commonDocuments = uniqueDocuments.filter((uniqueDocument) => {
            return documentsResult.some((documentResult) => {
              return (
                uniqueDocument._id.toString() ===
                documentResult._id.toString()
              );
            });
          });
          documentsResult = commonDocuments;
        } else {
          documentsResult.push(...uniqueDocuments);
        }
      }
      if (tagType.level === "l2") {
        let categoryObject = {};
        for (const category of categoryFilter.categories) {
          Object.keys(category).forEach((key) => {
            // @ts-ignore
            Object.keys(category[key]).forEach((subKey) => {
              if (subKey === tagType.value.tagText) {
                // @ts-ignore
                categoryObject = category[key][subKey];
              }
            });
          });
        }
        // flatten the category object
        const keywords = flattenObject(categoryObject);
        keywords.push(tagType.value.tagText);
        console.log("Finding keywords", keywords);
        // TODO: null check for keywords
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
          documents.push({ ...document, _id: document._id.toString() , page });
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

        if (documentsResult.length > 0) {
          // find the common documents between uniqueDocuments and documentsResult
          // assuming that uniqueDocuments is a bigger array
          const commonDocuments = uniqueDocuments.filter((uniqueDocument) => {
            return documentsResult.some((documentResult) => {
              return (
                uniqueDocument._id.toString() ===
                documentResult._id.toString()
              );
            });
          });
          documentsResult = commonDocuments;
          console.log("Common Documents", commonDocuments.length);
        } else {
          documentsResult.push(...uniqueDocuments);
        }
      }
    }

    /**
     * if document type is not null
     * get the documents that have the matching document type
     * and filter unique documents by that
     */
    if (documentType !== null && documentType !== undefined) {
      documentsResult = documentsResult.filter((document) => {
        if (
          document.document_type !== null ||
          document.document_type !== undefined
        ) {
          return document.document_type === documentType;
        }
      });
    }

    res.status(200).json({ success: true, data: documentsResult });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
