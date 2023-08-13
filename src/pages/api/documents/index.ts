import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../services/db/connect";
import { getDocumentById, getDocumentByS3ObjectName } from "../../../services/db/document";
import { PageModel } from "@/models/page";
import { DocumentModel } from "@/models/document";
import { groupBy } from "lodash";
import { getSignedUrl } from "@/services/s3";
import flattenObject from "../../../utils/flatten-object";
import gs1Categories from "../../../data/gs1-categories";
import gs2Categories from "../../../data/gs2-categories";
import gs3Categories from "../../../data/gs3-categories";
import gs4Categories from "../../../data/gs4-categories";
import optionalsCategories from "../../../data/optionals-categories";
import searchByKeyword from "@/utils/search-by-keyword";
import searchBySubjectTags from "@/utils/search-by-subject-tags";

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
    
    const { search, pageNumber, documentType, subjectTags } = req.body;
    let documentsResult: any[] = [];

    if (search) {
      const keywordSearchDocResults = await searchByKeyword(search, pageNumber);
      documentsResult.push(...keywordSearchDocResults);
    }

   
    if (subjectTags) {

      const tagSearchResults = await searchBySubjectTags(subjectTags);

      if (documentsResult.length > 0) {
        // find the common documents between uniqueDocuments and documentsResult
        const commonDocuments = tagSearchResults.filter((uniqueDocument) => {
          return documentsResult.some((documentResult) => {
            return (
              // @ts-ignore
              uniqueDocument._id.toString() ===
              documentResult._id.toString()
            );
          });
        });
        documentsResult = commonDocuments;
      } else {
        documentsResult.push(...tagSearchResults);
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
        const docTypeResults = await DocumentModel.find({document_type: documentType}).lean().exec();
        for (const doc of docTypeResults) {
          // get the first 5 pages of this doc
        }
      }

      
    }

    res.status(200).json({ success: true, data: documentsResult });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
