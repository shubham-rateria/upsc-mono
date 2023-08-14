import { DocumentModel } from "@/models/document";
import { PageModel } from "@/models/page";
import { getSignedUrl } from "@/services/s3";

/**
 * This function takes a document and if:
 * 1. Pages does not exist
 * 2. Pages length === 0,
 * fills the document with the first 5 pages of the document
 */
// @ts-ignore
export default async function fillDocWithPages(doc: DocumentModel) {
  const docPages: any[] = [];
  if (!doc.pages || doc.pages.length === 0) {
    const document = await DocumentModel.findById(doc._id).lean().exec();
    // @ts-ignore
    const pages = document?.pages?.slice(0, 5);
    if (pages) {
      for (const page of pages) {
        const pageId = page._ref.oid.toString();
        const pageData = await PageModel.findById(pageId)
          .select({
            ocr: 0,
            category_tags: 0,
            keyword_tags: 0,
            keyword_tags_1: 0,
            clean_text: 0,
          })
          .lean();
        // @ts-ignore
        if (pageData.s3_img_object_name) {
          const s3_signed_url = await getSignedUrl(
            "page-img",
            // @ts-ignore
            pageData.s3_img_object_name,
            5
          );
          // @ts-ignore
          pageData.s3_signed_url = s3_signed_url;
        }
        docPages.push(pageData);
      }
    }
    return docPages;
  }
  return null;
}
