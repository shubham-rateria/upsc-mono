import React, { useState, useEffect, useContext } from "react";
import styles from "./DocumentViewer.module.css";
import { ApiError, MatchingBlock, PageResult, Result } from "usn-common";
import { Document, Page, pdfjs } from "react-pdf";
import "./DocumentViewer.css";
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Modal,
  Progress,
} from "semantic-ui-react";
import { InView } from "react-intersection-observer";
import { range } from "lodash";
import axiosInstance from "../../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { SearchParamsContext } from "../../../contexts/SearchParamsContext";
import { GeneralSearchQueries } from "../../../analytics/types";
import { AnalyticsClassContext } from "../../../analytics/AnalyticsClass";
import { UserContext } from "../../../contexts/UserContextProvider";
import { observer } from "mobx-react-lite";
import ReferralModal from "../../../components/ReferralModal/ReferralModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentViewerPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
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
  const [downloadMode, setDownloadMode] = useState(0);
  const [downloadRangeFrom, setDownloadRangeFrom] = useState<number | null>(
    null
  );
  const [downloadRangeTo, setDownloadRangeTo] = useState<number | null>(null);
  const [downloadRangeError, setDownloadRangeError] = useState(false);
  const [downloadRangeErrMsg, setDownloadRangeErrMsg] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [noDownloadModalOpen, setNoDownloadModalOpen] = useState(false);
  const [lastPageChangeTime, setLastPageChangeTime] = useState(200000000000000);
  const [docLoadedTimestamp, setDocLoadedTimestamp] = useState(-1);
  const [docLoadStartTime, setDocLoadStartTime] = useState(-1);
  const [fileDownloading, setFileDownloading] = useState(false);
  const [openReferralModal, setOpenReferralModal] = useState(false);

  const searchParamsClass = useContext(SearchParamsContext);
  const analyticsClass = useContext(AnalyticsClassContext);

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
    setDocLoadedTimestamp(Date.now());
    const urlParams = new URLSearchParams(window.location.search);

    const data: GeneralSearchQueries = {
      text_searched: searchParamsClass.searchParams.keyword,
      notes_filter_type:
        searchParamsClass.searchParams.documentType === -1
          ? undefined
          : searchParamsClass.searchParams.documentType,
      subject_selected:
        (searchParamsClass.searchParams.subjectTags?.length || 0) > 0
          ? // @ts-ignore
            searchParamsClass.searchParams.subjectTags[0].optionalsName ??
            // @ts-ignore
            searchParamsClass.searchParams.subjectTags[0].type
          : undefined,
      topper_filter_selected: searchParamsClass.searchParams.topper,
      search_type: "keyword",
    };

    analyticsClass.triggerDocumentOpened({
      page_number: parseInt(urlParams.get("pageNumber") || "-1"),
      ...data,
      document_name: document?.s3_object_name || "",
      column_no: parseInt(urlParams.get("colNo") || "-1"),
      // @ts-ignore
      feed_type: urlParams.get("feedType") || "primary",
      row_no: parseInt(urlParams.get("rowNo") || "-1"),
      result: "pass",
      time_taken: Date.now() - docLoadStartTime,
    });

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

    setLastPageChangeTime(Date.now());
  };

  const handlePdfLoadError = () => {
    setDocLoadedTimestamp(Date.now());
    const urlParams = new URLSearchParams(window.location.search);

    const data: GeneralSearchQueries = {
      text_searched: searchParamsClass.searchParams.keyword,
      notes_filter_type:
        searchParamsClass.searchParams.documentType === -1
          ? undefined
          : searchParamsClass.searchParams.documentType,
      subject_selected:
        (searchParamsClass.searchParams.subjectTags?.length || 0) > 0
          ? // @ts-ignore
            searchParamsClass.searchParams.subjectTags[0].value.tagText
          : undefined,
      topper_filter_selected: searchParamsClass.searchParams.topper,
      search_type: "keyword",
    };

    analyticsClass.triggerDocumentOpened({
      page_number: parseInt(urlParams.get("pageNumber") || "-1"),
      ...data,
      document_name: document?.s3_object_name || "",
      column_no: parseInt(urlParams.get("colNo") || "-1"),
      // @ts-ignore
      feed_type: urlParams.get("feedType") || "primary",
      row_no: parseInt(urlParams.get("rowNo") || "-1"),
      result: "fail",
      time_taken: Date.now() - docLoadStartTime,
    });
    setLastPageChangeTime(Date.now());
  };

  const handlePageChange = (pageNumber: number) => {
    const timeNow = Date.now();
    const delta = timeNow - lastPageChangeTime;
    if (delta > 2000) {
      // console.log({ timeNow, lastPageChangeTime });
      analyticsClass.triggerDocumentPageImpression({
        document_name: document?.s3_object_name || "",
        page_no: currentActivePage || -1,
        time_spent: timeNow - lastPageChangeTime,
      });
    }
    setLastPageChangeTime(Date.now());
    setCurrentActivePage(pageNumber);
  };

  const handleNextDocSearchResult = () => {
    if (currentDocSearchResultIdx !== null && documentSearchResult !== null) {
      let updatedIdx = currentDocSearchResultIdx + 1;
      if (updatedIdx >= documentSearchResult.pages.length) {
        updatedIdx = 0;
      }
      analyticsClass.triggerDocViewerSearchNav({
        current_result_no: currentDocSearchResultIdx,
        doc_viewer_text_search: documentSearchText || "",
        jump_to: updatedIdx,
      });
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
      analyticsClass.triggerDocViewerSearchNav({
        current_result_no: currentDocSearchResultIdx,
        doc_viewer_text_search: documentSearchText || "",
        jump_to: updatedIdx,
      });
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

    const urlParams = new URLSearchParams(window.location.search);
    const data: GeneralSearchQueries = {
      text_searched: searchParamsClass.searchParams.keyword,
      notes_filter_type:
        searchParamsClass.searchParams.documentType === -1
          ? undefined
          : searchParamsClass.searchParams.documentType,
      subject_selected:
        (searchParamsClass.searchParams.subjectTags?.length || 0) > 0
          ? // @ts-ignore
            searchParamsClass.searchParams.subjectTags[0].value.tagText
          : undefined,
      topper_filter_selected: searchParamsClass.searchParams.topper,
      search_type: "keyword",
    };

    const startTime = Date.now();

    try {
      const response = await axiosInstance.post(
        `/api/documents/${documentId}/search`,
        {
          searchTerm: text,
        }
      );

      analyticsClass.triggerSearchInDocViewer({
        page_number: parseInt(urlParams.get("pageNumber") || "-1"),
        ...data,
        clicked_on: "page",
        document_name: document?.s3_object_name || "",
        column_no: parseInt(urlParams.get("colNo") || "-1"),
        // @ts-ignore
        feed_type: urlParams.get("feedType") || "primary",
        row_no: parseInt(urlParams.get("rowNo") || "-1"),
        result: "pass",
        time_taken: Date.now() - startTime,
        doc_viewer_text_searched: text,
        matching_results_count: response.data.data.pages.length,
      });

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
    const urlParams = new URLSearchParams(window.location.search);

    const data: GeneralSearchQueries = {
      text_searched: searchParamsClass.searchParams.keyword,
      notes_filter_type:
        searchParamsClass.searchParams.documentType === -1
          ? undefined
          : searchParamsClass.searchParams.documentType,
      subject_selected:
        (searchParamsClass.searchParams.subjectTags?.length || 0) > 0
          ? // @ts-ignore
            searchParamsClass.searchParams.subjectTags[0].value.tagText
          : undefined,
      topper_filter_selected: searchParamsClass.searchParams.topper,
      search_type: "keyword",
    };

    analyticsClass.triggerDocViewExited({
      page_number: parseInt(urlParams.get("pageNumber") || "-1"),
      ...data,
      document_name: urlParams.get("documentName") || "",
      column_no: parseInt(urlParams.get("colNo") || "-1"),
      // @ts-ignore
      feed_type: urlParams.get("feedType") || "primary",
      row_no: parseInt(urlParams.get("rowNo") || "-1"),
      result: "pass",
      exited_through: "back_button",
      time_spent: Date.now() - docLoadedTimestamp,
    });

    // router.back();
    navigate("/search");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleDocumentSearch(documentSearchText);
    }
  };

  const handleDownload = async (e: any) => {
    e.stopPropagation();
    setFileDownloading(true);

    if (user.remainingDownloads.free <= 0) {
      setOpenReferralModal(true);
      setFileDownloading(false);
      return;
    }

    // setNoDownloadModalOpen(true);
    try {
      const response = await axiosInstance.get(`/api/documents/${documentId}`);
      const url = response.data.data.s3_signed_url;
      const element = window.document.createElement("a");
      element.style.display = "none";
      window.document.body.appendChild(element);
      element.setAttribute("href", url);
      element.setAttribute("target", "_blank");
      element.className = self.name;
      element.click();
      window.document.body.removeChild(element);
      const data = {
        fileS3ObjectName: response.data.data.s3_object_name,
        userId: user.userId,
      };
      await axiosInstance.post("/api/usage/file-download", data);
      await user.getRemainingDownloads();
    } catch (error) {
      console.log("Could not download part", error);
    }
    setFileDownloading(false);
  };

  const handleModalClose = () => {
    setOpenReferralModal(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const documentId = urlParams.get("documentId");
      setDocumentId(documentId);

      const data: GeneralSearchQueries = {
        text_searched: searchParamsClass.searchParams.keyword,
        notes_filter_type:
          searchParamsClass.searchParams.documentType === -1
            ? undefined
            : searchParamsClass.searchParams.documentType,
        subject_selected:
          (searchParamsClass.searchParams.subjectTags?.length || 0) > 0
            ? // @ts-ignore
              searchParamsClass.searchParams.subjectTags[0].value.tagText
            : undefined,
        topper_filter_selected: searchParamsClass.searchParams.topper,
        search_type: "keyword",
      };

      try {
        const response = await axiosInstance.get(
          `/api/documents/${documentId}`
        );
        setDocLoadStartTime(Date.now());
        setDocument(response.data.data);
      } catch (error: any) {
        analyticsClass.triggerDocumentOpened({
          page_number: parseInt(urlParams.get("pageNumber") || "-1"),
          ...data,
          document_name: urlParams.get("documentName") || "",
          column_no: parseInt(urlParams.get("colNo") || "-1"),
          // @ts-ignore
          feed_type: urlParams.get("feedType") || "primary",
          row_no: parseInt(urlParams.get("rowNo") || "-1"),
          result: "fail",
          time_taken: -1,
        });
        setError({
          error: true,
          message: error.message,
        });
      }
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    user.getRemainingDownloads();
  }, [user.userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error.error) {
    return <div>Error in loading document. {error.message}</div>;
  }

  return (
    <div>
      <ReferralModal open={openReferralModal} onClose={handleModalClose} />
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
            <div className={styles.BackButton} onClick={handleBack}>
              <img src="/icons/do-arrow-back.svg" />
              Back
            </div>
            {/* <Button icon basic className={styles.BookmarkButton}>
              <Icon name="bookmark" />
              Bookmark
            </Button> */}
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
                        {documentSearchResult.pages.length} Results
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
            <div className={styles.PageNumber}>
              Page {currentActivePage || ""} / {document?.num_pages}
            </div>
          </div>
          <Document
            file={document?.s3_signed_url}
            className={styles.Document}
            onLoadSuccess={handlePdfLoadSuccess}
            onLoadError={handlePdfLoadError}
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
                    width={window.innerWidth * 0.65 * 0.6}
                  />
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
                <td className={styles.TopperDetailsValue}>
                  {document?.topper?.year}
                </td>
              </tr>
              <tr>
                <td>Rank</td>
                <td className={styles.TopperDetailsValue}>
                  AIR {document?.topper?.rank}
                </td>
              </tr>
            </table>
          </div>
          {/* <Divider /> */}
          {/* <div className={styles.MatchedKeywords}>
            <div className={styles.Header}>Matched Keywords</div>
          </div> */}
          {/* <Divider /> */}
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
              <div>{user.remainingDownloads.free} downloads remaining</div>
              <div onClick={handleDownload}>
                <Button
                  icon
                  className={styles.DownloadButton}
                  labelPosition="left"
                  loading={fileDownloading}
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
});

export default DocumentViewerPage;
