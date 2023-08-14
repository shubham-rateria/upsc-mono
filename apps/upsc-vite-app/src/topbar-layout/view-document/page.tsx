import React, { useState, useEffect } from "react";
import styles from "./DocumentViewer.module.css";
import { ApiError, MatchingBlock, PageResult, Result } from "../../types";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "./DocumentViewer.css";
import { Button, Checkbox, Divider, Icon, Input } from "semantic-ui-react";
import { InView } from "react-intersection-observer";
import { range } from "lodash";
import { useRouter } from "next/navigation";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentViewerPage: React.FC = () => {
  const router = useRouter();
  const [documentId, setDocumentId] = useState<string | null>();
  const [document, setDocument] = useState<Result>();
  const [loading, setLoading] = useState(true);
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
  const [downloadMode, setDownloadMode] = useState(0);
  const [downloadRangeFrom, setDownloadRangeFrom] = useState<number | null>(
    null
  );
  const [downloadRangeTo, setDownloadRangeTo] = useState<number | null>(null);
  const [downloadRangeError, setDownloadRangeError] = useState(false);
  const [downloadRangeErrMsg, setDownloadRangeErrMsg] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

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
  };

  const handleDocumentSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await axios.post(`/api/documents/${documentId}/search`, {
        searchTerm: documentSearchText,
      });
      setDocumentSearchResult(response.data.data);
      if (response.data.data.pages.length > 0) {
        setCurrentDocSearchResultIdx(0);
        scrollToPageNumber(response.data.data.pages[0].page_number);
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
        (r) => r.page_number === pageNumber
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
        (r) => r.page_number === pageNumber
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
        (r) => r.page_number === pageNumber
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

  const handleRangeFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setDownloadRangeFrom(val);
    if (downloadRangeTo !== null && val > downloadRangeTo) {
      setDownloadRangeError(true);
      setDownloadRangeErrMsg("From value has to be less than To");
    } else {
      setDownloadRangeError(false);
    }
  };

  const handleRangeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setDownloadRangeTo(val);
    if (downloadRangeFrom !== null && val < downloadRangeFrom) {
      setDownloadRangeError(true);
      setDownloadRangeErrMsg("To value has to be less than From");
    } else {
      setDownloadRangeError(false);
    }
  };

  const handleBack = () => {
    // router.back();
    router.push("/search");
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const documentId = urlParams.get("documentId");
      setDocumentId(documentId);
      try {
        const response = await axios.get(`/api/documents/${documentId}`);
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
            <div className={styles.BackButton} onClick={handleBack}>
              <img src="/icons/do-arrow-back.svg" />
              Back
            </div>
            <Button icon basic className={styles.BookmarkButton}>
              <Icon name="bookmark" />
              Bookmark
            </Button>
            <div className={styles.DocumentSearchInput}>
              <Input
                onChange={handleDocSearchTextChange}
                value={documentSearchText}
                label={
                  <Button
                    onClick={handleDocumentSearch}
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
                  <div>
                    <div
                      className={styles.UpDownButton}
                      onClick={handlePrevDocSearchResult}
                    >
                      <img src="/icons/do-chevron-up.svg" alt="up results" />
                    </div>
                  </div>
                  <div>{(currentDocSearchResultIdx || 0) + 1}</div>
                  <div>/</div>
                  <div>{documentSearchResult.pages.length} Results</div>
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
                </div>
              )}
            </div>
            <div className={styles.PageNumber}>
              Page {currentActivePage || ""} / {document?.num_pages}
            </div>
          </div>
          <Document
            file={document?.s3_signed_url}
            className={styles.Document}
            onLoadSuccess={handlePdfLoadSuccess}
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
                  <Page pageNumber={index + 1} />
                </InView>
              </div>
            ))}
          </Document>
        </div>
        <div className={styles.DocumentDetails}>
          <div className={styles.Card}>
            <div className={styles.DocumentName}>
              <img src="/icons/do-document-text.svg" alt="document text" />
              {document?.s3_object_name}{" "}
              <span className={styles.NumPages}>
                {document?.num_pages} Pages
              </span>
            </div>
          </div>
          <div className={styles.TopperCard}>
            <div className={styles.TopperName}>
              <img
                className={styles.Icon}
                src="/icons/do-ribbon.svg"
                alt="icon"
              />
              {document?.topper?.name}
            </div>
            <table className={styles.TopperDetailsTable}>
              <tr>
                <td>Year</td>
                <td className={styles.TopperDetailsValue}>2022</td>
              </tr>
              <tr>
                <td>Rank</td>
                <td className={styles.TopperDetailsValue}>AIR 1</td>
              </tr>
            </table>
          </div>
          <Divider />
          <div className={styles.MatchedKeywords}>
            <div className={styles.Header}>Matched Keywords</div>
          </div>
          <Divider />
          <div className={styles.DownloadSection}>
            <div className={styles.Header}>Download</div>
            <div className={styles.DownloadOptions}>
              <Checkbox
                radio
                label="All Pages"
                name="checkboxRadioGroup"
                value="all"
                className={styles.Option}
                checked={downloadMode === 0}
                onMouseDown={() => {
                  setDownloadMode(0);
                }}
              />
              <Checkbox
                radio
                label="Page Range"
                name="checkboxRadioGroup"
                value="range"
                className={styles.Option}
                checked={downloadMode === 1}
                onMouseDown={() => {
                  setDownloadMode(1);
                }}
              />
              <div
                className={styles.NumberInputs}
                onClick={() => {
                  if (downloadMode !== 1) {
                    setDownloadMode(1);
                  }
                }}
              >
                <Input
                  placeholder="Page From"
                  fluid
                  type="number"
                  size="mini"
                  disabled={downloadMode !== 1}
                  error={downloadRangeError}
                  value={downloadRangeFrom}
                  onChange={handleRangeFromChange}
                />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  -
                </div>
                <Input
                  placeholder="Page To"
                  fluid
                  type="number"
                  size="mini"
                  disabled={downloadMode !== 1}
                  error={downloadRangeError}
                  value={downloadRangeTo}
                  onChange={handleRangeToChange}
                />
              </div>
              {downloadRangeError && (
                <div className={styles.Error}>{downloadRangeErrMsg}</div>
              )}
              <div>
                <Button
                  icon
                  className={styles.DownloadButton}
                  labelPosition="left"
                >
                  <Icon name="download" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
