import { PageModel } from "../models/page";

function getWordBlocksForPage(docPage: any) {
  const blocks: any[] = [];
  docPage.ocrPages.forEach((page: any) => {
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

export default async (keyword: string, documentId: string) => {
  const pipeline: any = [
    {
      $search: {
        index: "page_search",
        text: {
          query: keyword,
          path: "clean_text",
        },
        highlight: {
          path: "clean_text", // Replace with the same field you are searching in
        },
      },
    },
    {
      $project: {
        _id: 1,
        documentId: 1,
        page_number: 1,
        s3_img_object_name: 1,
        highlights: { $meta: "searchHighlights" },
        score: {
          $meta: "searchScore",
        },
      },
    },
    {
      $match: {
        documentId,
      },
    },
    {
      $lookup: {
        from: "page",
        localField: "_id",
        foreignField: "_id",
        as: "targetPage",
      },
    },
    {
      $addFields: {
        ocrPages: {
          $arrayElemAt: ["$targetPage.ocr.fullTextAnnotation.pages", 0],
        },
      },
    },
    {
      $project: {
        documentId: 1,
        pages: 1,
        // s3_object_name: "$targetDoc.s3_object_name",
        // topper: "$targetDoc.topper",
        // l0_categories: "$targetDoc.l0_categories",
        // num_pages: "$targetDoc.num_pages",
        // document_type: "$targetDoc.document_type",
        // highlights: { $meta: "searchHighlights" },
        page_number: 1,
        ocrPages: 1,
      },
    },
  ];

  const pages: any = await PageModel.aggregate(pipeline).exec();

  const results: any = [];

  if (pages.length > 0) {
    for (const page of pages) {
      const blocks = getWordBlocksForPage(page);

      const searchBlocks: any[] = [];
      const searchTerms = keyword.toLowerCase().split(" ");
      for (const block of blocks) {
        for (const term of searchTerms) {
          if (block.text.toLowerCase() === term) {
            searchBlocks.push(block);
          }
        }
      }

      const result = {
        matching_blocks: searchBlocks,
        page_number: page.page_number,
        height: page.ocrPages[0].height,
        width: page.ocrPages[0].width,
      };

      results.push(result);
    }
  }

  return results;
};
