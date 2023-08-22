import { DocumentModel } from "../../../models/document";
import { Request, Response, Router } from "express";
import { getSignedUrl } from "../../../services/s3";
import searchByKeyword from "../../../utils/search-by-keyword";
import searchBySubjectTags from "../../../utils/search-by-subject-tags";
import searchByTopper from "../../../utils/search-by-topper";
import fillDocWithPages from "../../../utils/fill-doc-with-pages";
import mongoose from "mongoose";
import { PageModel } from "../../../models/page";
import { type SearchParams } from "usn-common";

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
      console.log("getting doc id");

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
    const searchParams: SearchParams = req.body;
    let documentsResult: any[] = [];
    let hasKeyword = false;

    if (searchParams.keyword && searchParams.keyword.length > 0) {
      hasKeyword = true;
      const keywordSearchDocResults = await searchByKeyword(searchParams);
      documentsResult.push(...keywordSearchDocResults);
    }

    if (
      !hasKeyword &&
      searchParams.subjectTags &&
      searchParams.subjectTags.length > 0
    ) {
      if (documentsResult.length > 0) {
        // documentsResult = documentsResult.filter((doc) => {
        //   for (const tag of searchParams.subjectTags || []) {
        //     return doc.l0_categories.includes(mapTagTypeToNumber[tag.type]);
        //   }
        // });
      } else {
        const tagSearchResults = await searchBySubjectTags(searchParams);

        console.log("tagSearchResults", tagSearchResults.length);
        documentsResult = tagSearchResults;
      }
    }

    if (searchParams.topper) {
      if (documentsResult.length > 0) {
        // documentsResult = documentsResult.filter((doc) => {
        //   return (
        //     doc.topper?.name === searchParams.topper?.name &&
        //     doc.topper?.rank === searchParams.topper?.rank &&
        //     doc.topper?.year === searchParams.topper?.year
        //   );
        // });
      } else {
        const topperResults = await searchByTopper(searchParams);
        documentsResult.push(...topperResults);
      }
    }

    /**
     * if document type is not null
     * get the documents that have the matching document type
     * and filter unique documents by that
     */
    // if (
    //   searchParams.documentType !== null &&
    //   searchParams.documentType !== undefined
    // ) {
    //   if (documentsResult.length > 0) {
    //     documentsResult = documentsResult.filter((document) => {
    //       if (
    //         document.document_type !== null &&
    //         document.document_type !== undefined
    //       ) {
    //         return document.document_type === searchParams.documentType;
    //       } else {
    //         console.log("no doc type", document._id);
    //       }
    //     });
    //   } else {
    //     const docTypeResults = await DocumentModel.find({
    //       document_type: searchParams.documentType,
    //     })
    //       .lean()
    //       .exec();
    //     for (const doc of docTypeResults) {
    //       // get the first 5 pages of this doc
    //     }
    //   }
    // }

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
      console.log("doc search");

      const { documentId } = req.params;
      const { searchTerm } = req.body;

      const document = await DocumentModel.findById(documentId).lean();

      if (!document) {
        res.status(500).json({ success: false, data: "No Docs." });
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
      console.error("error in doc search", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};
