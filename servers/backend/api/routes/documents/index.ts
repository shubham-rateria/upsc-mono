import { DocumentModel } from "../../../models/document";
import { Request, Response, Router } from "express";
import { getSignedUrl } from "../../../services/s3";
import searchByKeyword, {
  searchByKeywordNot,
} from "../../../utils/search-by-keyword";
import searchBySubjectTags from "../../../utils/search-by-subject-tags";
import searchByTopper from "../../../utils/search-by-topper";
import fillDocWithPages from "../../../utils/fill-doc-with-pages";
import mongoose from "mongoose";
import { PageModel } from "../../../models/page";
import { type SearchParams } from "usn-common";
import searchKeywordInDoc from "../../../utils/search-keyword-in-doc";

const ObjectId = mongoose.Types.ObjectId;

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
    let otherResults: any[] = [];
    let hasKeyword = false;

    if (searchParams.keyword && searchParams.keyword.length > 0) {
      hasKeyword = true;
      const keywordSearchDocResults = await searchByKeyword(searchParams);

      // if keyword search results is 0, remove all remaining params
      // and search only for keyword and add to other results
      if (keywordSearchDocResults.length <= 2) {
        console.log("searching for others");
        otherResults = await searchByKeywordNot(searchParams);
        console.log("done", otherResults.length);
      }
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

    if (searchParams.topper && !searchParams.keyword) {
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

    console.log("other results", otherResults.length);

    otherResults = await Promise.all(
      otherResults.map(async (doc) => {
        const pages = await fillDocWithPages(doc);
        if (pages) {
          return { ...doc, pages };
        } else {
          return doc;
        }
      })
    );

    console.log("other results 2", otherResults.length);

    res
      .status(200)
      .json({ success: true, data: documentsResult, others: otherResults });
  });

  route.post("/:documentId/search", async (req: Request, res: Response) => {
    try {
      console.log("doc search");

      const { documentId } = req.params;
      const { searchTerm } = req.body;

      const results = await searchKeywordInDoc(searchTerm, documentId);

      // const document = await DocumentModel.findById(documentId).lean();

      // if (!document) {
      //   res.status(500).json({ success: false, data: "No Docs." });
      //   return;
      // }

      // // @ts-ignore
      // const pageIds = document?.pages.map((page) => page._ref.oid.toString());

      // const searchResultPromises: any[] = [];

      // for (const pageId of pageIds) {
      //   const search = PageModel.find({
      //     _id: new ObjectId(pageId),
      //     $text: { $search: searchTerm },
      //   })
      //     .lean()
      //     .exec();
      //   searchResultPromises.push(search);
      // }

      // const results = (await Promise.all(searchResultPromises))
      //   .map((r) => {
      //     if (r.length > 0) {
      //       const blocks = getWordBlocksForPage(r[0]);

      //       const searchBlocks: any[] = [];
      //       const searchTerms = searchTerm.toLowerCase().split(" ");
      //       for (const block of blocks) {
      //         for (const term of searchTerms) {
      //           if (block.text.toLowerCase() === term) {
      //             searchBlocks.push(block);
      //           }
      //         }
      //       }

      //       return {
      //         matching_blocks: searchBlocks,
      //         page_number: r[0].page_number,
      //         height: r[0].ocr.fullTextAnnotation.pages[0].height,
      //         width: r[0].ocr.fullTextAnnotation.pages[0].width,
      //       };
      //     }
      //   })
      //   .filter((r) => r);

      res.status(201).json({ success: true, data: { pages: results } });
    } catch (error: any) {
      console.error("error in doc search", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};
