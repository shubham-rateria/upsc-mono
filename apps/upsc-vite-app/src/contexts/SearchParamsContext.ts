import {
  type Result,
  type SearchParams,
  type Tag,
  type Topper,
} from "usn-common";
import React from "react";
import { makeAutoObservable } from "mobx";
import axiosInstance from "../utils/axios-instance";
import { analyticsClass } from "../analytics/AnalyticsClass";

const defaultValues: SearchParams = {
  documentType: -1,
  keyword: undefined,
  subjectTags: [],
  topper: undefined,
  year: -1,
  favourites: false,
  pageNumber: 0,
};

class CancelablePromise {
  promise: any;
  isCanceled: boolean;

  constructor(promise: any) {
    this.promise = promise;
    this.isCanceled = false;

    this.cancel = this.cancel.bind(this);
    this.then = this.then.bind(this);
    this.catch = this.catch.bind(this);
  }

  cancel() {
    this.isCanceled = true;
  }

  public async then(onFulfilled: any, onRejected?: any) {
    return this.promise.then((response: any) => {
      if (this.isCanceled) {
        return Promise.reject(new Error("Promise canceled"));
      } else {
        onFulfilled(response);
      }
    }, onRejected);
  }

  async catch() {
    if (this.isCanceled) {
      return Promise.reject(new Error("Promise canceled"));
    }
    return this.promise.catch(() => {});
  }
}

class SearchParamsClass {
  public searchParams: SearchParams = defaultValues;
  public docSearchResults: Result[] = [];
  public otherResults: Result[] = [];
  public searching: boolean = false;
  public searchingNextResults: boolean = false;
  public lastSearchPromise: CancelablePromise | null = null;
  public lastSearchParams: SearchParams = defaultValues;

  pageNumber: number = 1;

  public addSubjectTag(tag: Tag) {
    this.searchParams.subjectTags?.push(tag);
    this.pageNumber = 1;
  }

  public removeSubjectTag(tag: Tag) {
    const index = this.searchParams.subjectTags?.findIndex(
      (t) => t.value.tagText == tag.value.tagText
    );
    if (index !== undefined && index !== -1) {
      this.searchParams.subjectTags?.splice(index, 1);
    }
    this.pageNumber = 1;
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
    this.pageNumber = 1;
  }

  public clearFilters() {
    this.searchParams = defaultValues;
    this.lastSearchParams = defaultValues;
    this.docSearchResults = [];
    this.pageNumber = 1;
  }

  public defaultState() {
    return !(
      (this.lastSearchParams.subjectTags &&
        this.lastSearchParams.subjectTags?.length > 0) ||
      this.lastSearchParams.keyword ||
      this.lastSearchParams.topper
    );
  }

  public async getNext() {
    // don't get next results if results are already loading
    if (this.searchingNextResults || this.searching) {
      return;
    }

    this.searchingNextResults = true;
    this.pageNumber += 1;
    // @ts-ignore
    await this.getCancelableSearchPromise();
    this.searchingNextResults = false;
  }

  public getCancelableSearchPromise() {
    const data: SearchParams = {
      keyword: this.searchParams.keyword,
      pageNumber: this.pageNumber,
      documentType:
        this.searchParams.documentType === -1
          ? undefined
          : this.searchParams.documentType,
      subjectTags:
        (this.searchParams.subjectTags?.length || 0) > 0
          ? this.searchParams.subjectTags
          : undefined,
      topper: this.searchParams.topper,
    };
    const axiosPromise = axiosInstance.post("/api/documents", data);
    const cancelablePromise = new CancelablePromise(axiosPromise);
    const startTime = Date.now();
    cancelablePromise
      .then((response: any) => {
        if (response.data) {
          const subjectSelected =
            searchParamsClass.searchParams.subjectTags || [];
          const tags =
            searchParamsClass.searchParams.subjectTags?.filter(
              (tag: Tag) => tag.level === "l1" || tag.level === "l2"
            ) || [];
          const endTime = Date.now() - startTime;
          let searchType = "keyword";

          if (this.docSearchResults === null) {
            this.docSearchResults = [];
          }
          if (this.pageNumber === 1) {
            // @ts-ignore
            this.docSearchResults.replace(response.data.data);
            // @ts-ignore
            this.otherResults.replace(response.data.others);
          } else {
            // @ts-ignore
            this.docSearchResults.replace([
              ...this.docSearchResults,
              ...response.data.data,
            ]);
            // @ts-ignore
            this.otherResults.replace([
              ...this.otherResults,
              ...response.data.others,
            ]);
          }

          if ((this.searchParams.keyword || "").length > 0) {
            analyticsClass.triggerKeywordSearchUsed({
              search_type: "keyword",
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched: searchParamsClass.searchParams.keyword || "",
              topper_filter_selected: searchParamsClass.searchParams.topper,
            });
            searchType = "keyword";
          }

          if (tags.length > 0) {
            analyticsClass.triggerKeywordSearchUsed({
              search_type: "topic",
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched: tags[0].value.tagText,
              topper_filter_selected: searchParamsClass.searchParams.topper,
            });
            searchType = "topic";
          }

          if (this.lastSearchParams.documentType !== data.documentType) {
            analyticsClass.triggerNotesTypesFilterUsed({
              // @ts-ignore
              search_type: searchType,
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched:
                searchType === "keyword"
                  ? this.searchParams.keyword
                  : tags[0].value.tagText,
              topper_filter_selected: searchParamsClass.searchParams.topper,
              notes_filter_used: true,
            });
          }

          if (!Object.is(this.lastSearchParams.topper, data.topper)) {
            analyticsClass.triggerTopperFilterUsed({
              // @ts-ignore
              search_type: searchType,
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched:
                searchType === "keyword"
                  ? this.searchParams.keyword
                  : tags[0].value.tagText,
              topper_filter_selected: searchParamsClass.searchParams.topper,
              used: true,
            });
          }

          if (
            response.data.data.length > 0 &&
            response.data.others.length === 0
          ) {
            analyticsClass.triggerResultsShown({
              // @ts-ignore
              search_type: searchType,
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched:
                searchType === "keyword"
                  ? this.searchParams.keyword
                  : tags[0].value.tagText,
              topper_filter_selected: searchParamsClass.searchParams.topper,
              result: "pass",
              time_taken: endTime,
              feed_type: "primary",
              primary_feed_item_count: response.data.data.length,
              pagination_page_number: data.pageNumber || -1,
            });
          }

          if (
            response.data.data.length > 0 &&
            response.data.others.length > 0
          ) {
            analyticsClass.triggerResultsShown({
              // @ts-ignore
              search_type: searchType,
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched:
                searchType === "keyword"
                  ? this.searchParams.keyword
                  : tags[0].value.tagText,
              topper_filter_selected: searchParamsClass.searchParams.topper,
              result: "pass",
              time_taken: endTime,
              feed_type: "primary, secondary",
              primary_feed_item_count: response.data.data.length,
              secondary_feed_item_count: response.data.others.length,
              pagination_page_number: data.pageNumber || -1,
            });
          }

          if (
            response.data.others.length > 0 &&
            response.data.data.length === 0
          ) {
            analyticsClass.triggerResultsShown({
              // @ts-ignore
              search_type: searchType,
              subject_selected:
                subjectSelected.length > 0
                  ? subjectSelected[0].value.tagText
                  : undefined,
              notes_filter_type: searchParamsClass.searchParams.documentType,
              text_searched:
                searchType === "keyword"
                  ? this.searchParams.keyword
                  : tags[0].value.tagText,
              topper_filter_selected: searchParamsClass.searchParams.topper,
              result: "pass",
              time_taken: endTime,
              feed_type: "secondary",
              primary_feed_item_count: response.data.others.length,
              pagination_page_number: data.pageNumber || -1,
            });
          }
        }
        this.searching = false;
        this.lastSearchParams = data;
      })
      .catch((error: any) => {
        console.log("Promise error", error);
      });
    return cancelablePromise;
  }

  public async searchForDocuments() {
    if (this.pageNumber === 1) {
      this.searching = true;
    }
    if (this.lastSearchPromise) {
      this.lastSearchPromise.cancel();
    }

    try {
      this.lastSearchPromise = this.getCancelableSearchPromise();
      const elem = document.getElementById("results-section");
      elem?.scrollTo(0, 0);
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
