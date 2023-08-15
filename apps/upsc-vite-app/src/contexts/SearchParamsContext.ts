import { Result, SearchParams, Tag, Topper } from "../types";
import React from "react";
import { makeAutoObservable } from "mobx";
import axiosInstance from "../utils/axios-instance";

const defaultValues: SearchParams = {
  documentType: -1,
  keyword: undefined,
  subjectTags: [],
  topper: undefined,
  year: -1,
  favourites: false,
};

class SearchParamsClass {
  public searchParams: SearchParams = defaultValues;
  public docSearchResults: Result[] | null = null;
  public searching: boolean = false;

  public addSubjectTag(tag: Tag) {
    this.searchParams.subjectTags?.push(tag);
  }

  public removeSubjectTag(tag: Tag) {
    const index = this.searchParams.subjectTags?.findIndex(
      (t) => t.value.tagText == tag.value.tagText
    );
    if (index !== undefined && index !== -1) {
      this.searchParams.subjectTags?.splice(index, 1);
    }
  }

  public tagExists(tag: Tag) {
    const tags = this.searchParams.subjectTags?.filter(
      (fTag) =>
        fTag.level === tag.level && fTag.value.tagText === tag.value.tagText
    );
    if (tags && tags.length > 0) {
      return true;
    }
    return false;
  }

  public topperSelected(topper: Topper) {
    if (!this.searchParams.topper) {
      return false;
    }
    return (
      this.searchParams.topper?.name === topper.name &&
      this.searchParams.topper?.rank === topper.rank &&
      this.searchParams.topper?.year === topper.year
    );
  }

  public setSearchParams(params: SearchParams) {
    this.searchParams = { ...this.searchParams, ...params };
  }

  public async searchForDocuments() {
    this.searching = true;
    try {
      const response = await axiosInstance.post("/api/documents", {
        search: this.searchParams.keyword,
        pageNumber: 1,
        documentType:
          this.searchParams.documentType === -1
            ? null
            : this.searchParams.documentType,
        subjectTags:
          (this.searchParams.subjectTags?.length || 0) > 0
            ? this.searchParams.subjectTags
            : null,
        topper: this.searchParams.topper,
      });
      if (response.data) {
        if (this.docSearchResults === null) {
          this.docSearchResults = [];
        }
        // @ts-ignore
        this.docSearchResults.replace(response.data.data);
      }
      this.searching = false;
    } catch (error) {
      console.error("Error in getting documents:", error);
    }
  }

  constructor() {
    makeAutoObservable(this, {}, { deep: true });
  }
}

export const searchParamsClass = new SearchParamsClass();

export const SearchParamsContext =
  React.createContext<SearchParamsClass>(searchParamsClass);
