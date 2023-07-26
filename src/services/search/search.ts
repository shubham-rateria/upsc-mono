import axios from "axios";
import { Tag, DocumentType, Result } from "../../types";

type SetSearchParams = {
  keywordSearch: string | null;
  tagSearch: Tag[] | null;
  documentTypeSearch: DocumentType | null;
};

export class Search {
  keywordSearch: string | null = null;
  tagSearch: Tag[] | null = null;
  documentTypeSearch: DocumentType | null = null;

  setSearchParams(params: SetSearchParams) {
    this.keywordSearch = params.keywordSearch;
    this.tagSearch = params.tagSearch;
    this.documentTypeSearch = params.documentTypeSearch;
  }

  async getResults(): Promise<Result[] | null | undefined> {
    try {
      const response = await axios.post("/api/documents", {
        search: this.keywordSearch,
        documentType: this.documentTypeSearch,
        tags: this.tagSearch,
        pageNumber: 1,
      });
      return response.data?.data;
    } catch (error) {}
  }
}
