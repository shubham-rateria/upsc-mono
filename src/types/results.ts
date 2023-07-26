type Result = {
  s3_object_name: string;
  num_pages: number;
  document_type: number | null;
  topper?: {
    name?: string,
    rank?: number,
    year?: number,
  },
  pages: [
    {
      page_number: number;
      s3_img_object_name: number;
      clean_text: string;
      s3_signed_url: string;
      matching_words?: string[];
    }
  ];
};
export type { Result };
