export type MatchingBlock = {
  text: string;
  boundingBox: any;
};

export type PageResult = {
  _ref?: {
    $id: string;
  };
  page_number: number;
  s3_img_object_name?: string;
  clean_text?: string;
  s3_signed_url?: string;
  matching_words?: string[];
  matching_blocks?: MatchingBlock[];

  /**
   * height of the page returned by Vision API OCR
   */
  height?: number;

  /**
   * width of the page returned by Vision API OCR
   */
  width?: number;
};

export type Result = {
  _id?: string;
  s3_object_name: string;
  num_pages: number;
  document_type: number | null;
  topper?: {
    name?: string;
    rank?: number;
    year?: number;
  };
  pages: PageResult[];
  s3_signed_url?: string;
  l0_categories?: number[];
};
