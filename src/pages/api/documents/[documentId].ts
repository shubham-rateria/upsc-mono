import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../services/db/connect";
import { getDocumentById, getDocumentByS3ObjectName } from "../../../services/db/document";
import { PageModel } from "@/models/page";
import { DocumentModel } from "@/models/document";
import { getSignedUrl } from "@/services/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { documentId } = req.query;

      const document = await getDocumentById(documentId as string);

      if (!document) {
        res.status(500).json({success: false});
        return;
      }

      const s3_signed_url = await getSignedUrl(
        "upsc-files",
        // @ts-ignore
        document.s3_object_name,
        5
      );

      res.status(201).json({ success: true, data: {...document, s3_signed_url} });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } 
}
