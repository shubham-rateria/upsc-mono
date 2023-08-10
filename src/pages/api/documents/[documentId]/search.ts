import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../../services/db/connect";
import { getDocumentById } from "../../../../services/db/document";
import { getSignedUrl } from "@/services/s3";
import { PageModel } from "@/models/page";
import mongoose from "mongoose";
import levenshtein from "fast-levenshtein";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { documentId } = req.query;
      const { searchTerm } = req.body;

      const document = await getDocumentById(documentId as string);

      if (!document) {
        res.status(500).json({ success: false });
        return;
      }

      // @ts-ignore
      const pageIds = document?.pages.map((page) => page._ref.oid.toString());

      const searchResultPromises = [];

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

            const searchBlocks = [];
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

            // const matching_words = searchTerm
            //   .toLowerCase()
            //   .split(" ")
            //   .filter((word: string) => {
            //     const regex = new RegExp(`\\b${word}\\b`, "i");
            //     return regex.test(r[0].clean_text?.toLowerCase());
            //   });
            // return { matching_words, page_number: r[0].page_number };
          }
        })
        .filter((r) => r);

      res.status(201).json({ success: true, data: { pages: results } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
