"use client";

import React, { useState, useEffect } from "react";
import styles from "./DocumentViewer.module.css";
import {
  ApiError,
  PageResult,
  Result,
} from "@/types";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "./DocumentViewer.css";
import { Button, Icon, Input, Label } from "semantic-ui-react";
import { InView } from "react-intersection-observer";
import { range } from "lodash";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Props = {
  params: {
    documentId: string;
  };
};

const SampleSearchResult: Result = {
  pages: [
    { matching_words: ["a", "word"], page_number: 1 },
    { matching_words: ["a", "word"], page_number: 2 },
    { matching_words: ["a", "word"], page_number: 3 },
    { matching_words: ["a", "word"], page_number: 4 },
  ],
  num_pages: -1,
  document_type: 1,
  s3_object_name: ""
}

const DocumentViewerPage: React.FC<Props> = ({ params }) => {
  const [document, setDocument] = useState<Result>();
  const [loading, setLoading] = useState(true);
  const [currentActivePage, setCurrentActivePage] = useState<number | null>(
    null
  );
  const [documentSearchResult, setDocumentSearchResult] =
    useState<Result | null>(SampleSearchResult);
  const [currentDocSearchResultIdx, setCurrentDocSearchResultIdx] = useState<
    number | null
  >(0);
  const [documentSearchText, setDocumentSearchText] = useState<string | null>(
    null
  );

  const [error, setError] = useState<ApiError>({
    error: false,
    message: "",
  });

  const scrollToPageNumber = (pageNumber: string | number) => {
    const el = window.document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const handlePdfLoadSuccess = () => {
    // scroll to a page if specified by 'page' query
    const urlParams = new URLSearchParams(window.location.search);
    const pageNumber = urlParams.get("page");
    if (pageNumber) {
      setTimeout(() => {
        scrollToPageNumber(pageNumber);
      }, 100);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentActivePage(pageNumber);
  };

  const handleNextDocSearchResult = () => {
    if (currentDocSearchResultIdx !== null && documentSearchResult !== null) {
      let updatedIdx = currentDocSearchResultIdx + 1;
      if (updatedIdx >= documentSearchResult.pages.length) {
        updatedIdx = 0;
      }
      setCurrentDocSearchResultIdx(updatedIdx);
      scrollToPageNumber(documentSearchResult.pages[updatedIdx].page_number);
    }
  };

  const handlePrevDocSearchResult = () => {
    if (currentDocSearchResultIdx !== null && documentSearchResult !== null) {
      let updatedIdx = currentDocSearchResultIdx - 1;
      if (updatedIdx < 0) {
        updatedIdx = documentSearchResult.pages.length - 1;
      }
      setCurrentDocSearchResultIdx(updatedIdx);
      scrollToPageNumber(documentSearchResult.pages[updatedIdx].page_number);
    }
  };

  const handleDocSearchTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocumentSearchText(e.target.value);
    console.log(e.target.value);
  };

  const handleDocumentSearch = async () => {
    try {
      const response = await axios.post(
        `/api/documents/${params.documentId}/search`,
        { searchTerm: documentSearchText }
      );
      setDocumentSearchResult(response.data.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const getMatchingResultsForPage = (pageNumber: number): string[] | undefined => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0].matching_words;
      }
    }
    return undefined;
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/documents/${params.documentId}`);
        setDocument(response.data.data);
      } catch (error: any) {
        setError({
          error: true,
          message: error.message,
        });
      }
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error.error) {
    return <div>Error in loading document. {error.message}</div>;
  }

  return (
    <div>
      <div className={styles.PageContainer}>
        <div className={styles.DocumentViewerContainer}>
          <div className={styles.DocumentTopBar}>
            <Button icon>
              <Icon name="bookmark" />
              Bookmark
            </Button>
            <div className={styles.DocumentSearchInput}>
              <Input
                onChange={handleDocSearchTextChange}
                label={<Button onClick={handleDocumentSearch}>Search</Button>}
                labelPosition="right"
                placeholder="Search Document..."
              />
              {documentSearchResult && (
                <div className={styles.DocumentSearchResult}>
                  <div>
                    <Button
                      size="small"
                      basic
                      circular
                      icon="arrow alternate circle up outline"
                      onClick={handlePrevDocSearchResult}
                    />
                  </div>
                  <div>
                    {(currentDocSearchResultIdx || 0) + 1} /{" "}
                    {documentSearchResult.pages.length} Results
                  </div>
                  <div>
                    <Button
                      size="small"
                      basic
                      circular
                      icon="arrow alternate circle down outline"
                      onClick={handleNextDocSearchResult}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>{currentActivePage || ""}</div>
          </div>
          <Document
            file={document?.s3_signed_url}
            className={styles.Document}
            onLoadSuccess={handlePdfLoadSuccess}
          >
            {range(document?.num_pages || 0).map((index) => (
              <div className={styles.Page} key={index}>
                <div className={styles.MatchingResults}>
                  {getMatchingResultsForPage(index + 1)?.map((r) => (
                    <Label tag key={r}>
                      {r}
                    </Label>
                  ))}
                </div>
                <InView
                  as="div"
                  threshold={0.8}
                  onChange={(inView, entry) => {
                    handlePageChange(index + 1);
                  }}
                >
                  <Page pageNumber={index + 1} />
                </InView>
              </div>
            ))}
          </Document>
        </div>
        <div className={styles.DocumentDetails}>
          <div className={styles.Card}>
            <div className={styles.DocumentName}>
              {document?.s3_object_name}
            </div>
            <div className={styles.NumPages}>10 pages</div>
          </div>
          <div className={styles.Card}>
            <div className={styles.TopperHeader}>Topper Details</div>
            <div className={styles.TopperName}>{document?.topper?.name}</div>
            <div className={styles.TopperRank}>
              AIR {document?.topper?.rank}
            </div>
            <div className={styles.TopperYear}>{document?.topper?.year}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
