import React, { useState, useEffect, useContext } from "react";
import styles from "./DocumentViewer.module.css";
import { ApiError, MatchingBlock, PageResult, Result } from "usn-common";
import { Document, Page, pdfjs } from "react-pdf";
import "./DocumentViewer.css";
import { Button, Input, Modal, Progress } from "semantic-ui-react";
import { InView } from "react-intersection-observer";
import { range, truncate } from "lodash";
import axiosInstance from "../../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState<string | null>();
  const [document, setDocument] = useState<Result>();
  const [loading, setLoading] = useState(true);
  const [documentLoadingPercent, setDocumentLoadingPercent] = useState(0);
  const [currentActivePage, setCurrentActivePage] = useState<number | null>(
    null
  );
  const [documentSearchResult, setDocumentSearchResult] =
    useState<Result | null>(null);
  const [currentDocSearchResultIdx, setCurrentDocSearchResultIdx] = useState<
    number | null
  >(0);
  const [documentSearchText, setDocumentSearchText] = useState<string | null>(
    null
  );
  // const [downloadRangeFrom, setDownloadRangeFrom] = useState<number | null>(
  //   null
  // );
  // const [downloadRangeTo, setDownloadRangeTo] = useState<number | null>(null);
  // const [downloadRangeError, setDownloadRangeError] = useState(false);
  // const [downloadRangeErrMsg, setDownloadRangeErrMsg] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [noDownloadModalOpen, setNoDownloadModalOpen] = useState(false);

  const searchParamsClass = useContext(SearchParamsContext);

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
    const urlParams = new URLSearchParams(window.location.search);
    const pageNumber = urlParams.get("page");

    if (pageNumber) {
      setTimeout(() => {
        scrollToPageNumber(pageNumber);
      }, 100);
    }

    if (
      searchParamsClass.searchParams.keyword &&
      searchParamsClass.searchParams.keyword.length > 0
    ) {
      setDocumentSearchText(searchParamsClass.searchParams.keyword);
      handleDocumentSearch(
        searchParamsClass.searchParams.keyword,
        pageNumber ? false : true
      );
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
  };

  const handleDocumentSearch = async (
    text: string | null,
    scrollToResult: boolean = true
  ) => {
    if (!text) {
      return;
    }
    setSearchLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/documents/${documentId}/search`,
        {
          searchTerm: text,
        }
      );
      setDocumentSearchResult(response.data.data);
      if (response.data.data.pages.length > 0) {
        setCurrentDocSearchResultIdx(-1);
        if (scrollToResult) {
          setCurrentDocSearchResultIdx(0);
          scrollToPageNumber(response.data.data.pages[0].page_number);
        }
      }
    } catch (error) {
      console.error("error", error);
    }
    setSearchLoading(false);
  };

  const getMatchingResultsForPage = (
    pageNumber: number
  ): PageResult | undefined => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r: any) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0];
      }
    }
    return undefined;
  };

  const getHeightForPage = (pageNumber: number): number => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r: any) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0].height || 1;
      }
    }
    return 1;
  };

  const getWidthForPage = (pageNumber: number): number => {
    if (documentSearchResult) {
      const filtered = documentSearchResult?.pages.filter(
        (r: any) => r.page_number === pageNumber
      );
      if (filtered.length > 0) {
        return filtered[0].width || 1;
      }
    }
    return 1;
  };

  const skewX = (pageNumber: number): number => {
    const el = window.document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    const elemWidth = el?.clientWidth ?? 0;
    return elemWidth / getWidthForPage(pageNumber);
  };

  const skewY = (pageNumber: number): number => {
    const el = window.document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    const elemHeight = el?.clientHeight ?? 0;
    return elemHeight / getHeightForPage(pageNumber);
  };

  // const handleRangeFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = parseInt(e.target.value);
  //   setDownloadRangeFrom(val);
  //   if (downloadRangeTo !== null && val > downloadRangeTo) {
  //     setDownloadRangeError(true);
  //     setDownloadRangeErrMsg("From value has to be less than To");
  //   } else {
  //     setDownloadRangeError(false);
  //   }
  // };

  // const handleRangeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = parseInt(e.target.value);
  //   setDownloadRangeTo(val);
  //   if (downloadRangeFrom !== null && val < downloadRangeFrom) {
  //     setDownloadRangeError(true);
  //     setDownloadRangeErrMsg("To value has to be less than From");
  //   } else {
  //     setDownloadRangeError(false);
  //   }
  // };

  const handleBack = () => {
    // router.back();
    navigate(-1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleDocumentSearch(documentSearchText);
    }
  };

  // const handleDownload = () => {
  //   setNoDownloadModalOpen(true);
  // };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const documentId = urlParams.get("documentId");
      setDocumentId(documentId);
      try {
        const response = await axiosInstance.get(
          `/api/documents/${documentId}`
        );
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
      <Modal
        open={noDownloadModalOpen}
        onClose={() => {
          setNoDownloadModalOpen(false);
        }}
        size="tiny"
        closeOnEscape
        closeIcon
      >
        <Modal.Content>
          <p>
            Download is currently unavailable since this is a trial product.
          </p>
          <p>
            Our team is working on implementing these features and download will
            be available in the final product.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              setNoDownloadModalOpen(false);
            }}
          >
            Close
          </Button>
        </Modal.Actions>
      </Modal>
      <div className={styles.PageContainer}>
        <div className={styles.DocumentViewerContainer}>
          <div className={styles.DocumentTopBar}>
            <div className={styles.TopbarItem}>
              <div className={styles.BackButton} onClick={handleBack}>
                <img src="/icons/do-arrow-back.svg" />
                Back
              </div>
              <div>{truncate(document?.s3_object_name, { length: 30 })}</div>
            </div>
            <div className={styles.TopbarItem}>
              <div className={styles.DocumentSearchInput}>
                <Input
                  onChange={handleDocSearchTextChange}
                  value={documentSearchText}
                  onKeyPress={handleKeyPress}
                  label={
                    <Button
                      onClick={() => {
                        handleDocumentSearch(documentSearchText);
                      }}
                      className={styles.SearchButton}
                      loading={searchLoading}
                    >
                      Search
                    </Button>
                  }
                  labelPosition="right"
                  placeholder="Search Document..."
                  className={styles.Input}
                />
                {documentSearchResult && (
                  <div className={styles.DocumentSearchResult}>
                    {documentSearchResult.pages.length > 0 ? (
                      <>
                        <div>
                          <div
                            className={styles.UpDownButton}
                            onClick={handlePrevDocSearchResult}
                          >
                            <img
                              src="/icons/do-chevron-up.svg"
                              alt="up results"
                            />
                          </div>
                        </div>
                        <div>
                          {(currentDocSearchResultIdx || 0) + 1} /{" "}
                          {documentSearchResult.pages.length}
                        </div>
                        <div>
                          <div
                            className={styles.UpDownButton}
                            onClick={handleNextDocSearchResult}
                          >
                            <img
                              src="/icons/do-chevron-down.svg"
                              alt="down results"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={styles.NoResults}>No Results</div>
                    )}
                  </div>
                )}
              </div>
              {(!documentSearchResult ||
                documentSearchResult?.pages.length === 0) && (
                <div className={styles.PageNumber}>
                  {currentActivePage || ""} / {document?.num_pages}
                </div>
              )}
            </div>
          </div>

          <Document
            file={document?.s3_signed_url}
            className={styles.Document}
            onLoadSuccess={handlePdfLoadSuccess}
            onLoadProgress={({ loaded, total }) => {
              setDocumentLoadingPercent((loaded * 100) / total);
            }}
            loading={
              <div className={styles.DocumentLoadingContainer}>
                <Progress
                  className={styles.DocLoadProgress}
                  active
                  percent={documentLoadingPercent.toFixed(0)}
                  // progress
                  size="tiny"
                >
                  Loading <span>{document?.s3_object_name} </span>
                </Progress>
              </div>
            }
          >
            {range(document?.num_pages || 0).map((index: number) => (
              <div className={styles.Page} key={index}>
                {getMatchingResultsForPage(index + 1)?.matching_blocks?.map(
                  (block: MatchingBlock, idx: number) => (
                    <div
                      className={styles.MatchingResults}
                      key={idx}
                      style={{
                        color: "blue",
                        background: "purple",
                        opacity: 0.3,
                        top: `${
                          (block.boundingBox.vertices[0].y * 100) /
                          getHeightForPage(index + 1)
                        }%`,
                        left: `${
                          (block.boundingBox.vertices[0].x * 100) /
                          getWidthForPage(index + 1)
                        }%`,
                        width: `${
                          skewX(index + 1) *
                          (block.boundingBox.vertices[1].x -
                            block.boundingBox.vertices[0].x)
                        }px`,
                        height: `${
                          skewY(index + 1) *
                          (block.boundingBox.vertices[3].y -
                            block.boundingBox.vertices[0].y)
                        }px`,
                      }}
                    />
                  )
                )}
                <InView
                  as="div"
                  threshold={0.8}
                  onChange={() => {
                    handlePageChange(index + 1);
                  }}
                >
                  <Page
                    pageNumber={index + 1}
                    width={window.innerWidth * 0.9}
                  />
                </InView>
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
