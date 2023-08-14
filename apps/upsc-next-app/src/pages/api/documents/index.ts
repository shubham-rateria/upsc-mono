import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../services/db/connect";
import {
  getDocumentById,
  getDocumentByS3ObjectName,
} from "../../../services/db/document";
import { PageModel } from "@/models/page";
import { DocumentModel } from "@/models/document";
import { groupBy } from "lodash";
import { getSignedUrl } from "@/services/s3";
import flattenObject from "../../../utils/flatten-object";
import searchByKeyword from "@/utils/search-by-keyword";
import searchBySubjectTags from "@/utils/search-by-subject-tags";
import searchByTopper from "@/utils/search-by-topper";
import fillDocWithPages from "@/utils/fill-doc-with-pages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { documentId } = req.body;

      const document = await getDocumentById(documentId as string);
      console.log({ document });

      res.status(201).json({ success: true, data: document });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "POST") {
    const { search, pageNumber, documentType, subjectTags, topper } = req.body;
    let documentsResult: any[] = [];

    if (search) {
      const keywordSearchDocResults = await searchByKeyword(search, pageNumber);
      documentsResult.push(...keywordSearchDocResults);
    }

    if (subjectTags) {
      const tagSearchResults = await searchBySubjectTags(subjectTags);

      console.log("tagSearchResults", tagSearchResults.length);

      if (documentsResult.length > 0) {
        // find the common documents between uniqueDocuments and documentsResult
        const commonDocuments = documentsResult.filter((uniqueDocument) => {
          return tagSearchResults.some((tagSearchResult) => {
            return (
              // @ts-ignore
              uniqueDocument._id.toString() === tagSearchResult._id.toString()
            );
          });
        });
        documentsResult = commonDocuments;
      } else {
        documentsResult.push(...tagSearchResults);
      }
    }

    if (topper) {
      const topperResults = await searchByTopper(topper);
      if (documentsResult.length > 0) {
        // find the common documents between uniqueDocuments and documentsResult
        const commonDocuments = documentsResult.filter((uniqueDocument) => {
          return topperResults.some((topperResult) => {
            return (
              // @ts-ignore
              uniqueDocument._id.toString() === topperResult._id.toString()
            );
          });
        });
        documentsResult = commonDocuments;
      } else {
        documentsResult.push(...topperResults);
      }
    }

    /**
     * if document type is not null
     * get the documents that have the matching document type
     * and filter unique documents by that
     */
    if (documentType !== null && documentType !== undefined) {
      if (documentsResult.length > 0) {
        documentsResult = documentsResult.filter((document) => {
          if (
            document.document_type !== null ||
            document.document_type !== undefined
          ) {
            return document.document_type === documentType;
          }
        });
      } else {
        const docTypeResults = await DocumentModel.find({
          document_type: documentType,
        })
          .lean()
          .exec();
        for (const doc of docTypeResults) {
          // get the first 5 pages of this doc
        }
      }
    }

    documentsResult = await Promise.all(
      documentsResult.map(async (doc) => {
        const pages = await fillDocWithPages(doc);
        if (pages) {
          return { ...doc, pages };
        } else {
          return doc;
        }
      })
    );

    res.status(200).json({ success: true, data: documentsResult });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
