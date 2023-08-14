import { DocumentModel } from "../../../models/document";
import { Request, Response, Router } from "express";
import { getSignedUrl } from "../../../services/s3";
import searchByKeyword from "../../../utils/search-by-keyword";
import searchBySubjectTags from "../../../utils/search-by-subject-tags";
import searchByTopper from "../../../utils/search-by-topper";
import fillDocWithPages from "../../../utils/fill-doc-with-pages";
import mongoose from "mongoose";
import { PageModel } from "../../../models/page";

const ObjectId = mongoose.Types.ObjectId;

function getWordBlocksForPage(page: any) {
  const blocks: any[] = [];
  page.ocr.fullTextAnnotation.pages.forEach((page: any) => {
    page.blocks.forEach((block: any) => {
      block.paragraphs.forEach((paragraph: any) => {
        paragraph.words.forEach((word: any) => {
          const wordText = word.symbols.map((s: any) => s.text).join("");
          blocks.push({
            text: wordText,
            boundingBox: word.boundingBox,
          });
        });
      });
    });
  });

  return blocks;
}

const route = Router();

export default (app: Router) => {
  app.use("/documents", route);

  route.get("/:documentId", async (req: Request, res: Response) => {
    try {
      const { documentId } = req.params;

      const document = await DocumentModel.findById(documentId).lean().exec();

      if (!document) {
        res.status(500).json({ success: false });
        return;
      }

      const s3_signed_url = await getSignedUrl(
        "upsc-files",
        // @ts-ignore
        document.s3_object_name,
        5
      );

      res
        .status(201)
        .json({ success: true, data: { ...document, s3_signed_url } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  route.post("/", async (req: Request, res: Response) => {
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
  });

  route.post("/:documentId/search", async (req: Request, res: Response) => {
    try {
      const { documentId } = req.query;
      const { searchTerm } = req.body;

      const document = await DocumentModel.findById(documentId).lean();

      if (!document) {
        res.status(500).json({ success: false });
        return;
      }

      // @ts-ignore
      const pageIds = document?.pages.map((page) => page._ref.oid.toString());

      const searchResultPromises: any[] = [];

      for (const pageId of pageIds) {
        const search = PageModel.find({
          _id: new ObjectId(pageId),
          $text: { $search: searchTerm },
        })
          .lean()
          .exec();
        searchResultPromises.push(search);
      }

      const results = (await Promise.all(searchResultPromises))
        .map((r) => {
          if (r.length > 0) {
            const blocks = getWordBlocksForPage(r[0]);

            const searchBlocks: any[] = [];
            const searchTerms = searchTerm.toLowerCase().split(" ");
            for (const block of blocks) {
              for (const term of searchTerms) {
                if (block.text.toLowerCase() === term) {
                  searchBlocks.push(block);
                }
              }
            }

            return {
              matching_blocks: searchBlocks,
              page_number: r[0].page_number,
              height: r[0].ocr.fullTextAnnotation.pages[0].height,
              width: r[0].ocr.fullTextAnnotation.pages[0].width,
            };
          }
        })
        .filter((r) => r);

      res.status(201).json({ success: true, data: { pages: results } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};
