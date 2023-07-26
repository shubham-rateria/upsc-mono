import { DocumentModel } from "../../models/document";

export const getDocumentByS3ObjectName = async (s3ObjectName: string) => {
  try {
    const document = await DocumentModel.find({ s3_object_name: s3ObjectName }).populate('populatedPages').exec();
    return document;
  } catch (error) {
    throw error;
  }
};
